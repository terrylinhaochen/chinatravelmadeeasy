import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { admin, errorMessage, fingerprint, json, parseVideoUrl, preflight, verifyTurnstile } from "../_shared/ctme.ts";

type RateLimitResult = {
  allowed: boolean;
  limit_bucket: "hour" | "day" | null;
  retry_after_seconds: number;
};

type SubmissionResult = {
  video_id: string;
  video_slug: string | null;
  status: "queued" | "processing" | "published" | "rejected" | "removed";
  cached: boolean;
};

export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    const early = preflight(req); if (early) return early;
    try {
      const { url, turnstileToken } = await req.json();
      const parsed = parseVideoUrl(url);
      if (!await verifyTurnstile(turnstileToken || "", req.headers.get("cf-connecting-ip") || undefined)) return json({ error: "turnstile_failed" }, 403);
      const db = admin(); const fp = await fingerprint(req);
      const now = new Date();
      const hourStart = new Date(Math.floor(now.getTime() / 3600000) * 3600000).toISOString();
      const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
      const { data: rateData, error: rateError } = await db.rpc("consume_submission_rate_limit", {
        p_fingerprint_hash: fp,
        p_hour_start: hourStart,
        p_day_start: dayStart,
      }).single();
      if (rateError) throw rateError;
      const rate = rateData as RateLimitResult | null;
      if (!rate) throw new Error("rate_limit_failed");
      if (!rate.allowed) return json({ error: "rate_limited", limit: rate.limit_bucket, retryAfterSeconds: rate.retry_after_seconds }, 429);

      const { data: submissionData, error: submissionError } = await db.rpc("register_video_submission", {
        p_platform: parsed.platform,
        p_external_video_id: parsed.externalId,
        p_canonical_url: parsed.canonicalUrl,
        p_pipeline_version: "official-v1",
      }).single();
      if (submissionError) throw submissionError;
      const submission = submissionData as SubmissionResult | null;
      if (!submission) throw new Error("submission_failed");
      return json({
        videoId: submission.video_id,
        slug: submission.video_slug,
        status: submission.status,
        cached: submission.cached,
      }, submission.cached ? 200 : 202);
    } catch (error) { return json({ error: errorMessage(error) || "invalid_request" }, 400); }
  }),
};
