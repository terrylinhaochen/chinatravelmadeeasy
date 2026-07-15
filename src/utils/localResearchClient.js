import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabaseAuth.js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey =
  import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export async function submitLocalResearch(request) {
  if (!isSupabaseConfigured()) return { ok: false, configured: false, error: 'backend_not_configured' };
  const client = await getSupabaseBrowserClient();
  const { data } = await client.auth.getSession();
  const accessToken = data.session?.access_token;
  if (!accessToken) return { ok: false, configured: true, error: 'sign_in_required' };

  const response = await fetch(`${supabaseUrl}/functions/v1/submit-local-research`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  const payload = await response.json().catch(() => ({}));
  return response.ok
    ? { ok: true, configured: true, ...payload }
    : { ok: false, configured: true, error: payload.error || 'research_submission_failed' };
}
