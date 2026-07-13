// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "@supabase/server"
import { admin, errorMessage, isUuid, json, preflight, requireUser } from "../_shared/ctme.ts";

type SavedExperience = { id: string; created_at: string };

export default {
  fetch: withSupabase({ auth: "user" }, async (req) => {
    const early = preflight(req); if (early) return early;
    try {
      const { user } = await requireUser(req);
      const body = await req.json();
      const validMonth = !body.visitMonth || /^\d{4}-(0[1-9]|1[0-2])$/.test(String(body.visitMonth));
      if (!isUuid(body.placeId) || !isUuid(body.clientRequestId) || !['worth_it','mixed','skip'].includes(body.verdict) || String(body.note || '').length > 280 || !validMonth || !Array.isArray(body.tags || [])) return json({ error: 'invalid_experience' }, 400);
      const { data: savedData, error } = await admin().rpc('save_place_experience', {
        p_user_id: user.id,
        p_place_id: body.placeId,
        p_client_request_id: body.clientRequestId,
        p_verdict: body.verdict,
        p_note: body.note || null,
        p_visit_month: body.visitMonth ? `${body.visitMonth}-01` : null,
        p_season: body.season || null,
        p_context_tags: body.tags.slice(0, 8).map((tag: unknown) => String(tag).slice(0, 40)),
      }).single();
      if (error) throw error;
      const data = savedData as SavedExperience | null;
      if (!data) throw new Error('save_failed');
      return json(data, 201);
    } catch (error) {
      const message = errorMessage(error);
      return json({ error: message === 'unauthorized' ? 'unauthorized' : 'save_failed' }, message === 'unauthorized' ? 401 : 400);
    }
  }),
}
