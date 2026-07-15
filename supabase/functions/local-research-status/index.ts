import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { isUuid, json, preflight, requireUser } from "../_shared/ctme.ts";

export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    const early = preflight(req); if (early) return early;
    if (req.method !== "GET") return json({ error: "method_not_allowed" }, 405);
    const id = new URL(req.url).pathname.split("/").filter(Boolean).at(-1);
    if (!isUuid(id)) return json({ error: "missing_id" }, 400);
    try {
      const { client } = await requireUser(req);
      const { data: job, error } = await client.from("local_research_jobs")
        .select("id,destination,destination_language,intent,constraints,status,source_count,candidate_count,failure_code,created_at,completed_at")
        .eq("id", id)
        .single();
      if (error || !job) return json({ error: "not_found" }, 404);
      if (job.status !== "completed") return json({ job, candidates: [] });
      const { data: candidates, error: candidatesError } = await client.from("local_research_candidates")
        .select("id,rank,name_en,name_local,recommendation,traveler_caveat,source_platform,source_language,source_url,source_title,source_published_at,source_retrieved_at,evidence_excerpt,native_query,evidence_confidence,resolution_state,place_id,map_evidence")
        .eq("job_id", id)
        .order("rank");
      return candidatesError ? json({ error: "status_failed" }, 500) : json({ job, candidates: candidates || [] });
    } catch {
      return json({ error: "unauthorized" }, 401);
    }
  }),
};
