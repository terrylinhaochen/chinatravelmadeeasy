// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { admin, fingerprint, isUuid, json, preflight, verifyTurnstile } from "../_shared/ctme.ts";
export default {
  fetch: withSupabase({ auth: "none" }, async (req) => {
    const early = preflight(req); if (early) return early;
    try {
      const body = await req.json();
      const reason = String(body.reason || '').trim();
      const detail = String(body.detail || '').trim();
      if (!['video', 'place', 'experience'].includes(body.targetType) || !isUuid(body.targetId) || !reason || reason.length > 80 || detail.length > 500) return json({ error: 'invalid_report' }, 400);
      if (!await verifyTurnstile(body.turnstileToken || '', req.headers.get('cf-connecting-ip') || undefined)) return json({ error: 'turnstile_failed' }, 403);
      const { data, error } = await admin().from('content_reports').insert({ target_type: body.targetType, target_id: body.targetId, reason, detail: detail || null, fingerprint_hash: await fingerprint(req) }).select('id').single();
      if (error) throw error;
      return json(data, 201);
    } catch { return json({ error: 'report_failed' }, 400); }
  }),
};
