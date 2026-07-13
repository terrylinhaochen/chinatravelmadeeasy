import test from 'node:test';
import assert from 'node:assert/strict';
import { mayAutoPublish, normalizeVideoUrl, pickBindingEvidence, resolutionState } from '../pipeline/video_ingestion_contract.mjs';
import { destinationFieldNoteHref, nativeEmbedUrl, parseShortFormVideoUrl, videoCuratedCollectionHref } from '../src/utils/videoEmbed.js';
import { videoMapImportHref } from '../src/utils/communityMap.js';

test('accepts supported Instagram and TikTok links and rejects arbitrary hosts', () => {
  assert.equal(normalizeVideoUrl('https://www.instagram.com/reel/ABC_123/').platform, 'instagram');
  assert.equal(normalizeVideoUrl('https://www.tiktok.com/@creator/video/7412345678901234567').platform, 'tiktok');
  assert.throws(() => normalizeVideoUrl('https://example.com/video/123'), /unsupported_host/);
  assert.throws(() => normalizeVideoUrl('https://www.youtube.com/watch?v=4OJcNbiixEQ'), /unsupported_host/);
});
test('an explicit caption cannot be overridden by visual inference', () => {
  const evidence = pickBindingEvidence([{ type: 'visual', confidence: 0.99, city: 'Kyoto' }, { type: 'caption', confidence: 0.82, city: 'Fukuoka' }]);
  assert.equal(evidence.city, 'Fukuoka');
});
test('resolved requires score, city and provider identity agreement', () => {
  assert.equal(resolutionState(0.94, { cityAgreement: true, providerIdentityAgreement: true }), 'resolved');
  assert.equal(resolutionState(0.94, { cityAgreement: false, providerIdentityAgreement: true }), 'probable');
  assert.equal(resolutionState(0.72, { cityAgreement: true, providerIdentityAgreement: true }), 'unresolved');
});
test('engagement is not an auto-publication gate', () => {
  assert.equal(mayAutoPublish({ embeddable: true, chinaRelevant: true, duplicate: false, safe: true, spam: false, actionable: true, views: undefined, mentions: [{ resolution: 'resolved' }] }), true);
  assert.equal(mayAutoPublish({ embeddable: true, chinaRelevant: true, duplicate: false, safe: true, spam: false, actionable: true, mentions: [{ resolution: 'probable' }] }), false);
});

test('native previews support TikTok and Instagram only', () => {
  assert.equal(
    nativeEmbedUrl({ platform: 'tiktok', externalId: '7412345678901234567', sourceUrl: 'https://www.tiktok.com/@creator/video/7412345678901234567' }),
    'https://www.tiktok.com/player/v1/7412345678901234567?autoplay=1&loop=0',
  );
  assert.equal(
    nativeEmbedUrl({ platform: 'instagram', externalId: 'ABC_123', sourceUrl: 'https://www.instagram.com/reel/ABC_123/?utm_source=share' }),
    'https://www.instagram.com/reel/ABC_123/embed/',
  );
  assert.throws(() => nativeEmbedUrl({ platform: 'youtube', externalId: 'abc', sourceUrl: 'https://youtube.com/watch?v=abc' }), /unsupported_video_platform/);
});

test('the homepage video entry recognizes full TikTok and Instagram Reel URLs only', () => {
  assert.deepEqual(
    parseShortFormVideoUrl('https://www.tiktok.com/@creator/video/7412345678901234567?is_from_webapp=1'),
    { platform: 'tiktok', externalId: '7412345678901234567' },
  );
  assert.deepEqual(
    parseShortFormVideoUrl('https://www.instagram.com/reel/ABC_123/'),
    { platform: 'instagram', externalId: 'ABC_123' },
  );
  assert.throws(() => parseShortFormVideoUrl('https://youtu.be/abc'), /unsupported_video_platform/);
  assert.throws(() => parseShortFormVideoUrl('https://vm.tiktok.com/ZMshort/'), /unsupported_video_platform/);
});

test('video links return to the exact destination field note', () => {
  assert.equal(
    destinationFieldNoteHref({ destinationSlug: 'hong-kong', slug: 'harbour-day' }),
    '/regions/hong-kong/#field-note-harbour-day',
  );
  assert.equal(destinationFieldNoteHref({ slug: 'unassigned' }), '/discover/');
});

test('resolved video evidence opens the matching creator-attributed Curated city card', () => {
  assert.equal(
    videoCuratedCollectionHref({
      city: 'Chongqing',
      creator: 'Hugh Chongqing',
      title: 'Which floor is the ground floor in Chongqing?',
      places: [{ resolution: 'resolved' }],
    }),
    '/curated/hugh-chongqing/which-floor-is-the-ground-floor-in-chongqing/chongqing/',
  );
  assert.equal(videoCuratedCollectionHref({ city: 'Chongqing', creator: 'Traveler', title: 'Food lead', places: [] }), null);
});

test('video handoff includes resolved places and preserves the source', () => {
  const href = videoMapImportHref({
    city: 'Hong Kong',
    creator: 'Traveler',
    sourceUrl: 'https://www.tiktok.com/@traveler/video/123',
    places: [
      { name: 'Promenade', localName: '海濱花園', city: 'Hong Kong', address: 'Kowloon', evidence: 'Named in caption', resolution: 'resolved' },
      { name: 'Possible cafe', localName: '咖啡店', city: 'Hong Kong', address: 'Unknown', evidence: 'Visual guess', resolution: 'probable' },
    ],
  });
  const parsed = new URL(href, 'https://chinatravelmadeeasy.com');
  assert.match(parsed.searchParams.get('title'), /Hong Kong field note/);
  assert.match(parsed.searchParams.get('text'), /Promenade \/ 海濱花園 — Hong Kong/);
  assert.doesNotMatch(parsed.searchParams.get('text'), /Possible cafe/);
  assert.equal(parsed.searchParams.get('url'), 'https://www.tiktok.com/@traveler/video/123');
});
