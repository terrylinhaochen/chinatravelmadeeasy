import "@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "@supabase/server"
import { errorMessage, json, preflight, requireUser } from "../_shared/ctme.ts";
export default {
  fetch: withSupabase({ auth: "user" }, async (req) => {
    const early = preflight(req); if (early) return early;
    try {
      const { client, user } = await requireUser(req); const { placeIds, sourceVideoId, collectionId, collectionName, localMigrationKey } = await req.json();
      if (!Array.isArray(placeIds) || !placeIds.length || placeIds.length > 100) return json({ error: "invalid_place_ids" }, 400);
      let targetId = collectionId;
      if (!targetId) { const { data, error } = await client.from("map_collections").insert({ user_id: user.id, name: collectionName || "My China map", local_migration_key: localMigrationKey || null }).select("id").single(); if (error) throw error; targetId = data.id; }
      const { error } = await client.from("map_items").upsert(placeIds.map((placeId: string) => ({ collection_id: targetId, place_id: placeId, source_video_id: sourceVideoId || null })), { onConflict: "collection_id,place_id" }); if (error) throw error;
      return json({ collectionId: targetId, saved: placeIds.length });
    } catch (error) { const message = errorMessage(error); return json({ error: message === "unauthorized" ? "unauthorized" : "save_failed" }, message === "unauthorized" ? 401 : 400); }
  }),
}
