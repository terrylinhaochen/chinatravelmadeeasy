import { setUser } from './localPrototypeState.js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey =
  import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

let browserClient;
let createClientPromise;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

export async function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  if (!browserClient) {
    const createClient = await loadCreateClient();
    browserClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }
  return browserClient;
}

export async function sendSupabaseEmailLink(email, nextPath = '/profile/') {
  const supabase = await getSupabaseBrowserClient();
  if (!supabase) return { data: null, error: null, configured: false };

  const redirect = new URL('/auth/confirm/', window.location.origin);
  redirect.searchParams.set('next', nextPath);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirect.toString(),
    },
  });
  return { data, error, configured: true };
}

export async function completeSupabaseEmailLink() {
  const supabase = await getSupabaseBrowserClient();
  if (!supabase) {
    return {
      ok: false,
      configured: false,
      error: 'Supabase env vars are missing.',
      next: '/profile/',
      user: null,
    };
  }

  const url = new URL(window.location.href);
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
  const search = url.searchParams;
  const next = search.get('next') || '/profile/';
  const errorDescription =
    search.get('error_description') ||
    hash.get('error_description') ||
    search.get('error') ||
    hash.get('error');

  if (errorDescription) {
    return { ok: false, configured: true, error: errorDescription, next, user: null };
  }

  const tokenHash = search.get('token_hash');
  const type = search.get('type') || 'email';
  const code = search.get('code');
  const accessToken = hash.get('access_token') || search.get('access_token');
  const refreshToken = hash.get('refresh_token') || search.get('refresh_token');

  let result;
  if (tokenHash) {
    result = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
  } else if (code) {
    result = await supabase.auth.exchangeCodeForSession(code);
  } else if (accessToken && refreshToken) {
    result = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } else {
    result = await supabase.auth.getSession();
  }

  if (result.error) {
    return { ok: false, configured: true, error: result.error.message, next, user: null };
  }

  const user =
    result.data?.user ||
    result.data?.session?.user ||
    (await supabase.auth.getUser()).data?.user ||
    null;

  if (!user?.email) {
    return {
      ok: false,
      configured: true,
      error: 'The email link was opened, but Supabase did not return a user session.',
      next,
      user: null,
    };
  }

  setUser(user.email, {
    id: user.id,
    authProvider: 'supabase',
  });
  return { ok: true, configured: true, error: null, next, user };
}

async function loadCreateClient() {
  if (!createClientPromise) {
    createClientPromise = import('@supabase/supabase-js').then((module) => module.createClient);
  }
  return createClientPromise;
}
