import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { admin, errorMessage, json, preflight } from "../_shared/ctme.ts";
import { fetchOfficialMetadata, MetadataAdapterError } from "../_shared/videoMetadata.ts";

type ClaimedJob = {
  message_id: number;
  read_count: number;
  video_id: string;
  idempotency_key: string;
  platform: "tiktok" | "instagram";
  canonical_url: string;
  attempts: number;
  pipeline_version: string;
};

async function equalSecret(left: string, right: string) {
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  const [a, b] = await Promise.all([digest(left), digest(right)]);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

async function isAuthorized(req: Request) {
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const workerHeader = req.headers.get("x-worker-secret") || "";
  const allowed = [Deno.env.get("VIDEO_INGESTION_WORKER_SECRET"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")].filter(Boolean) as string[];
  if (!allowed.length) return false;
  for (const candidate of [bearer, workerHeader]) {
    if (!candidate) continue;
    for (const secret of allowed) if (await equalSecret(candidate, secret)) return true;
  }
  return false;
}

export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    const early = preflight(req); if (early) return early;
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    if (!await isAuthorized(req)) return json({ error: "unauthorized_worker" }, 401);

    let body: { batchSize?: number } = {};
    try { body = await req.json(); } catch { /* An empty body uses the safe default. */ }
    const requested = Number(body.batchSize ?? 3);
    const batchSize = Number.isInteger(requested) ? Math.min(Math.max(requested, 1), 5) : 3;
    const db = admin();
    const { data, error } = await db.rpc("claim_video_ingestion_jobs", {
      p_limit: batchSize,
      p_visibility_seconds: 120,
    });
    if (error) return json({ error: "queue_claim_failed" }, 500);

    const jobs = (data || []) as ClaimedJob[];
    const results: Array<{ videoId: string; status: "metadata_ready" | "retryable" | "failed"; error?: string }> = [];
    for (const job of jobs) {
      try {
        const metadata = await fetchOfficialMetadata(job, {
          instagramEndpoint: Deno.env.get("INSTAGRAM_OEMBED_ENDPOINT"),
          instagramAccessToken: Deno.env.get("INSTAGRAM_OEMBED_ACCESS_TOKEN"),
        });
        const { error: completionError } = await db.rpc("complete_video_metadata_stage", {
          p_message_id: job.message_id,
          p_video_id: job.video_id,
          p_idempotency_key: job.idempotency_key,
          p_provider: metadata.provider,
          p_provider_payload: metadata.providerPayload,
          p_title: metadata.title,
          p_creator_name: metadata.creatorName,
          p_poster_url: metadata.posterUrl,
          p_embed_state: metadata.embedState,
          p_metadata_hash: metadata.metadataHash,
          p_cache_expires_at: metadata.cacheExpiresAt,
        });
        if (completionError) throw new Error("metadata_completion_failed");
        results.push({ videoId: job.video_id, status: "metadata_ready" });
      } catch (caught) {
        const adapterError = caught instanceof MetadataAdapterError ? caught : null;
        const code = adapterError?.code || "metadata_processing_failed";
        const terminal = adapterError?.terminal ?? false;
        const { error: failureError } = await db.rpc("fail_video_ingestion_job", {
          p_message_id: job.message_id,
          p_video_id: job.video_id,
          p_idempotency_key: job.idempotency_key,
          p_error_code: code,
          p_terminal: terminal,
          p_retry_delay_seconds: adapterError?.retryAfterSeconds ?? 300,
        });
        if (failureError) {
          console.error("video ingestion failure transition failed", job.video_id, errorMessage(failureError));
          results.push({ videoId: job.video_id, status: "retryable", error: "failure_transition_failed" });
        } else {
          results.push({ videoId: job.video_id, status: terminal ? "failed" : "retryable", error: code });
        }
      }
    }

    return json({
      claimed: jobs.length,
      metadataReady: results.filter((result) => result.status === "metadata_ready").length,
      retryable: results.filter((result) => result.status === "retryable").length,
      failed: results.filter((result) => result.status === "failed").length,
      results,
    });
  }),
};
