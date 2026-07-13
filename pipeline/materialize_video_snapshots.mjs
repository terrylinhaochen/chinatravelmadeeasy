import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve('src/data/communityVideoSnapshots.json');
const base = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
if (!base || !key) {
  console.log('Video snapshot materialization skipped: dedicated Supabase public credentials are not configured.');
  process.exit(0);
}

const select = [
  'id,slug,platform,external_video_id,canonical_url,title,creator_name,city,poster_url,source_published_at,metadata_checked_at,experience_label,summary',
  'video_metric_snapshots(views,likes,comments,captured_at)',
  'video_place_mentions(evidence_type,evidence_text,confidence,resolution_state,places(id,slug,name_en,name_zh,city_en,category,place_provider_matches(provider,provider_place_id,provider_name,provider_address,latitude,longitude,match_score,checked_at)))',
].join(',');
const url = `${base}/rest/v1/videos?publication_state=eq.published&select=${encodeURIComponent(select)}&order=created_at.desc`;
const response = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
if (!response.ok) throw new Error(`Snapshot request failed: ${response.status} ${await response.text()}`);
const records = await response.json();
const snapshots = records.map((record) => {
  const metrics = [...(record.video_metric_snapshots || [])].sort((a, b) => String(b.captured_at).localeCompare(String(a.captured_at)))[0] || {};
  return {
    id: record.id, slug: record.slug, platform: record.platform, externalId: record.external_video_id, sourceUrl: record.canonical_url,
    title: record.title, creator: record.creator_name, city: record.city, poster: record.poster_url,
    publishedAt: record.source_published_at?.slice(0, 10), checkedAt: record.metadata_checked_at?.slice(0, 10), durationSeconds: 0,
    verdict: record.experience_label || 'mixed', summary: record.summary || '', views: metrics.views, likes: metrics.likes, comments: metrics.comments,
    saves: 0, wentCount: 0, helpfulCount: 0,
    places: (record.video_place_mentions || []).filter((mention) => mention.places).map((mention) => {
      const place = mention.places; const providers = place.place_provider_matches || []; const match = providers.find((item) => item.provider === 'amap') || providers[0];
      return { id: place.id, slug: place.slug, name: place.name_en, localName: place.name_zh, city: place.city_en, category: place.category || 'Place', address: match?.provider_address || '', latitude: match?.latitude, longitude: match?.longitude, amapPoiId: providers.find((item) => item.provider === 'amap')?.provider_place_id, applePlaceId: providers.find((item) => item.provider === 'apple')?.provider_place_id, resolution: mention.resolution_state, confidence: Number(mention.confidence), evidence: mention.evidence_text, evidenceType: mention.evidence_type === 'location_tag' ? 'caption' : mention.evidence_type, sourceFreshness: `Checked ${match?.checked_at?.slice(0, 10) || record.metadata_checked_at?.slice(0, 10)}` };
    }),
  };
});
await writeFile(output, `${JSON.stringify(snapshots, null, 2)}\n`);
console.log(`Materialized ${snapshots.length} published videos into ${output}.`);

