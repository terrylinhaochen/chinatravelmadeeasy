import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { build } from 'esbuild';
import { auditDestination, DESTINATION_RUBRIC, PUBLISHED_DESTINATION_SLUGS, selectHomepageVideos } from '../src/utils/destinationQuality.js';

async function bundledModule(entryPoint) {
  const result = await build({ entryPoints: [entryPoint], bundle: true, platform: 'node', format: 'esm', write: false });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

const [{ destinations }, { communityVideos }, { curatedCollections }] = await Promise.all([
  bundledModule('src/data/destinations.ts'),
  bundledModule('src/data/communityVideos.ts'),
  bundledModule('src/data/curatedCollections.ts'),
]);

test('every destination is evaluated against the same six-part editorial rubric', () => {
  assert.equal(destinations.length, 56);
  for (const destination of destinations) {
    const videos = communityVideos.filter((video) => video.destinationSlug === destination.slug);
    const audit = auditDestination(destination, videos);
    assert.deepEqual(audit.checks.map((check) => check.id), DESTINATION_RUBRIC.map((check) => check.id));
  }
});

test('only destinations with narrative, recovery, bilingual places, and sources receive full-digest treatment', () => {
  const full = destinations
    .filter((destination) => auditDestination(destination, communityVideos.filter((video) => video.destinationSlug === destination.slug)).tier === 'full')
    .map((destination) => destination.slug);
  assert.deepEqual(full, PUBLISHED_DESTINATION_SLUGS);
});

test('homepage traveler media represents different destinations instead of a Hong Kong-only rail', () => {
  const selected = selectHomepageVideos(communityVideos, 3);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected.map((video) => video.destinationSlug)).size, 3);
  assert.ok(selected.every((video) => video.places.some((place) => place.resolution === 'resolved')));
});

test('traveler-story titles are experiential hooks, not product workflow copy', () => {
  const forbidden = /\b(vertical slice|map-ready|safe pins?|evidence|resolve[ds]?|video-to-map|field note)\b/i;
  for (const video of communityVideos) assert.doesNotMatch(video.title, forbidden, video.slug);
});

test('public curated collections stay focused on China local guides and traveler videos', () => {
  const chinaBuckets = new Set(['hong-kong', 'shanghai', 'beijing', 'chongqing']);
  assert.ok(curatedCollections.length > 0);
  assert.equal(curatedCollections.some((collection) => collection.owner.slug === 'benny-chan'), false);

  for (const collection of curatedCollections) {
    assert.match(collection.kind, /^(local-research|traveler-video)$/);
    assert.ok(Object.keys(collection.regionBuckets).every((bucket) => chinaBuckets.has(bucket)), collection.slug);
    assert.ok(collection.places.every((place) => chinaBuckets.has(place.regionBucket)), collection.slug);
  }
});

test('public local-research UI is China-first and does not expose the archived Korea/Japan benchmark', async () => {
  const [localLens, mapImport] = await Promise.all([
    readFile(new URL('../src/pages/research/local-lens/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/map-import.astro', import.meta.url), 'utf8'),
  ]);

  assert.match(localLens, /Research in Chinese/);
  assert.match(localLens, /Chinese \(Simplified\)/);
  assert.doesNotMatch(localLens, /Korean|Japanese|Seoul/);
  assert.match(mapImport, /Shanghai, Hong Kong, Chengdu/);
  assert.doesNotMatch(mapImport, /Seoul|Osaka|Korean|Japanese/);
});
