import { getSupabaseBrowserClient, isSupabaseConfigured } from './supabaseAuth.js';

export async function submitVideo(url, turnstileToken = '') {
  if (!isSupabaseConfigured()) return { configured: false, status: 'backend_not_connected' };
  const client = await getSupabaseBrowserClient();
  const { data, error } = await client.functions.invoke('submit-video', { body: { url, turnstileToken } });
  return { configured: true, data, error };
}

export async function getVideoStatus(videoId) {
  if (!isSupabaseConfigured()) return { configured: false, status: 'backend_not_connected' };
  const client = await getSupabaseBrowserClient();
  const { data, error } = await client.functions.invoke(`video-status/${videoId}`, { method: 'GET' });
  return { configured: true, data, error };
}

export async function saveMapItems(payload) {
  if (!isSupabaseConfigured()) return { configured: false };
  const client = await getSupabaseBrowserClient();
  const { data, error } = await client.functions.invoke('save-map-items', { body: payload });
  return { configured: true, data, error };
}

export async function saveExperience(payload) {
  if (!isSupabaseConfigured()) return { configured: false };
  const client = await getSupabaseBrowserClient();
  const { data, error } = await client.functions.invoke('place-experience', { body: payload });
  return { configured: true, data, error };
}

export async function saveCorrection(payload) {
  if (!isSupabaseConfigured()) return { configured: false };
  const client = await getSupabaseBrowserClient();
  const { data, error } = await client.functions.invoke('place-correction', { body: payload });
  return { configured: true, data, error };
}

export async function getPublishedVideoCards() {
  if (!isSupabaseConfigured()) return { configured: false, data: [] };
  const client = await getSupabaseBrowserClient();
  const { data, error } = await client.from('published_video_cards').select('*').order('metadata_checked_at', { ascending: false });
  return { configured: true, data: data || [], error };
}

export async function migrateLocalListsOnce(lists) {
  if (!isSupabaseConfigured() || !lists?.length || localStorage.getItem('ctme-server-map-migration-complete')) return { migrated: false };
  for (const list of lists) {
    const placeIds = (list.places || []).map((place) => place.backendId).filter(Boolean);
    if (!placeIds.length) continue;
    const result = await saveMapItems({ placeIds, collectionName: list.name, localMigrationKey: list.id });
    if (result.error) return { migrated: false, error: result.error };
  }
  localStorage.setItem('ctme-server-map-migration-complete', new Date().toISOString());
  return { migrated: true };
}
