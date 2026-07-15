// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { admin, isUuid, json, preflight } from "../_shared/ctme.ts";
type ProcessingStatus = { job_status: string; attempts: number; error_code: string | null };
export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    const early = preflight(req); if (early) return early;
    const id = new URL(req.url).pathname.split("/").filter(Boolean).at(-1);
    if (!isUuid(id)) return json({ error: "missing_id" }, 400);
    const db = admin();
    const { data: video, error } = await db.from("videos").select("id,slug,publication_state").eq("id", id).single();
    if (error || !video) return json({ error: "not_found" }, 404);
    if (video.publication_state !== "published") {
      const { data } = await db.rpc("get_video_processing_status", { p_video_id: video.id }).maybeSingle();
      const job = data as ProcessingStatus | null;
      return json({
        videoId: video.id,
        slug: video.slug,
        status: video.publication_state,
        stage: job?.job_status || video.publication_state,
        attempts: job?.attempts || 0,
        error: job?.error_code || null,
        places: [],
      });
    }
    const { data: places, error: placesError } = await db.from("video_place_mentions")
      .select("id,evidence_type,evidence_text,confidence,resolution_state,places(id,slug,name_en,name_zh,city_en)")
      .eq("video_id", id)
      .eq("resolution_state", "resolved");
    return placesError
      ? json({ error: "status_failed" }, 500)
      : json({ videoId: video.id, slug: video.slug, status: video.publication_state, places: places || [] });
  }),
};
