import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { admin, errorMessage, json, preflight, requireUser } from "../_shared/ctme.ts";
import { parseLocalResearchRequest } from "../_shared/localResearch.ts";

type Registration = {
  local_research_job_id: string;
  local_research_status: string;
  cached: boolean;
};

export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    const early = preflight(req); if (early) return early;
    if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
    try {
      const { user } = await requireUser(req);
      const request = parseLocalResearchRequest(await req.json());
      const { data, error } = await admin().rpc("register_local_research_job", {
        p_user_id: user.id,
        p_destination: request.destination,
        p_destination_language: request.destinationLanguage,
        p_intent: request.intent,
        p_constraints: request.constraints,
        p_pipeline_version: "local-research-v1",
      }).single();
      if (error) throw error;
      const job = data as Registration | null;
      if (!job) throw new Error("research_submission_failed");
      return json({
        jobId: job.local_research_job_id,
        status: job.local_research_status,
        cached: job.cached,
      }, job.cached ? 200 : 202);
    } catch (error) {
      const message = errorMessage(error) || "invalid_request";
      return json({ error: message }, message === "unauthorized" ? 401 : 400);
    }
  }),
};
