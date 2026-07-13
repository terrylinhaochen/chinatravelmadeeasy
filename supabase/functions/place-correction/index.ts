// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "@supabase/server"
import { admin, errorMessage, isUuid, json, preflight, requireUser } from "../_shared/ctme.ts";

type SavedCorrection = { id: string; status: "open" | "accepted" | "rejected" };

export default {
  fetch: withSupabase({ auth: "user" }, async (req) => {
    const early = preflight(req); if (early) return early;
    try {
      const { user } = await requireUser(req);
      const body = await req.json();
      const allowedTypes = ['wrong_place', 'local_name', 'address', 'address_entrance', 'closed', 'duplicate'];
      const proposedValue = String(body.proposedValue || '').trim();
      const targetCount = Number(isUuid(body.placeId)) + Number(isUuid(body.videoMentionId));
      if (targetCount !== 1 || !isUuid(body.clientRequestId) || !allowedTypes.includes(body.type) || !proposedValue || proposedValue.length > 280 || (body.videoId && !isUuid(body.videoId))) return json({ error: 'invalid_correction' }, 400);
      const db = admin();
      const { data: savedData, error } = await db.rpc('save_place_correction', {
        p_user_id: user.id,
        p_place_id: isUuid(body.placeId) ? body.placeId : null,
        p_video_mention_id: isUuid(body.videoMentionId) ? body.videoMentionId : null,
        p_client_request_id: body.clientRequestId,
        p_correction_type: body.type,
        p_proposed_value: proposedValue,
      }).single();
      if (error) throw error;
      const data = savedData as SavedCorrection | null;
      if (!data) throw new Error('correction_failed');
      if (body.videoId) {
        const { error: queueError } = await db.rpc('enqueue_place_reresolution', { p_video_id: body.videoId, p_correction_id: data.id });
        if (queueError) throw queueError;
      }
      return json(data, 201);
    } catch (error) {
      const message = errorMessage(error);
      return json({ error: message === 'unauthorized' ? 'unauthorized' : 'correction_failed' }, message === 'unauthorized' ? 401 : 400);
    }
  }),
}
