import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  shanghaiLocalUseCollection,
  summarizeShanghaiLocalUse,
  validateShanghaiLocalUseCandidate,
  validateShanghaiLocalUseSourceNote,
} from '../src/data/shanghaiLocalUse.js';

test('the Yangpu collection publishes a small, source-backed local-use slice', () => {
  const summary = summarizeShanghaiLocalUse();
  assert.deepEqual(summary, {
    candidateCount: 4,
    sourceNoteCount: 3,
    directResidentCount: 1,
    resolvedCount: 1,
    sourceCount: 6,
  });
  assert.equal(shanghaiLocalUseCollection.sourceAccess.chineseLocalWeb, 'reviewed');
  assert.equal(shanghaiLocalUseCollection.sourceAccess.xiaohongshu, 'not-connected');
  assert.equal(shanghaiLocalUseCollection.sourceAccess.dianping, 'not-connected');
});

test('source notes link local evidence to candidates without implying all are map-ready', () => {
  const candidateById = new Map(shanghaiLocalUseCollection.candidates.map((candidate) => [candidate.id, candidate]));

  for (const note of shanghaiLocalUseCollection.sourceNotes) {
    const result = validateShanghaiLocalUseSourceNote(note);
    assert.equal(result.valid, true, `${note.id}: ${result.errors.join(', ')}`);
    assert.equal(note.originalLanguage, 'Chinese');
    assert.ok(note.candidateIds.every((id) => candidateById.has(id)));
    assert.ok(note.sources.length >= 1);
    assert.ok(note.sources.every((source) => source.url.startsWith('https://')));
  }

  const linkedCandidates = shanghaiLocalUseCollection.sourceNotes.flatMap((note) => note.candidateIds.map((id) => candidateById.get(id)));
  assert.ok(linkedCandidates.some((candidate) => candidate.resolutionState === 'probable'));
  assert.equal(linkedCandidates.filter((candidate) => candidate.resolutionState === 'resolved').length, 1);
});

test('every local-use candidate preserves bilingual identity, traveler context, and provenance', () => {
  for (const candidate of shanghaiLocalUseCollection.candidates) {
    const result = validateShanghaiLocalUseCandidate(candidate);
    assert.equal(result.valid, true, `${candidate.id}: ${result.errors.join(', ')}`);
    assert.match(candidate.address, /[\u3400-\u9fff]/u);
    assert.ok(candidate.sources.every((source) => source.url.startsWith('https://')));
  }
});

test('only a provider-resolved candidate is eligible for an automatic map save', () => {
  const resolved = shanghaiLocalUseCollection.candidates.filter((candidate) => candidate.resolutionState === 'resolved');
  const reviewRequired = shanghaiLocalUseCollection.candidates.filter((candidate) => candidate.resolutionState === 'probable');

  assert.deepEqual(resolved.map((candidate) => candidate.id), ['fuxing-island-park-local-use']);
  assert.equal(reviewRequired.length, 3);
  assert.ok(resolved[0].providerLinks.amap.includes('/place/'));
  assert.ok(resolved[0].providerLinks.apple.includes('/place'));
  assert.ok(reviewRequired.every((candidate) => /review/i.test(candidate.resolutionNote)));
});

test('the published collection keeps research candidates separate from safe pins', () => {
  const summary = summarizeShanghaiLocalUse();
  const savedCollectionPayload = {
    candidateCount: summary.candidateCount,
    placeCount: summary.resolvedCount,
    safePlaceCount: summary.resolvedCount,
  };

  assert.deepEqual(savedCollectionPayload, {
    candidateCount: 4,
    placeCount: 1,
    safePlaceCount: 1,
  });
});

test('the city collection save payload carries only map-ready local pins into Profile', async () => {
  const [cityPage, curatedIndex, profilePage, mapComponent, mapImportPage] = await Promise.all([
    readFile(new URL('../src/pages/curated/[owner]/[collection]/[city].astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/curated/index.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/profile.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/CuratedCollectionMap.astro', import.meta.url), 'utf8'),
    readFile(new URL('../src/pages/map-import.astro', import.meta.url), 'utf8'),
  ]);

  assert.match(cityPage, /const saveablePlaces = isLocalResearch[\s\S]+resolutionState === 'resolved'/);
  assert.match(cityPage, /places: saveablePlaces\.map/);
  assert.match(cityPage, /providerLinks: place\.providerLinks/);
  assert.match(cityPage, /Local evidence rubric/);
  assert.match(cityPage, /“Locals use it” has to be graded\./);
  assert.match(cityPage, /Provider check is separate\./);
  assert.match(cityPage, /resolvedCount\} of \{places\.length\} candidates is currently map-ready/);
  assert.match(cityPage, /Direct resident testimony/);
  assert.match(cityPage, /Corroborated local-use signal/);
  assert.match(cityPage, /Community-program proxy/);
  assert.match(cityPage, /Found a Chinese post locals actually use\?/);
  assert.match(cityPage, /href="\/map-import\/#contribute"/);
  assert.match(cityPage, /Prepare local evidence/);
  assert.match(mapImportPage, /id="contribute"/);
  assert.match(mapImportPage, /window\.location\.hash === '#contribute'[\s\S]+contributionDetails\.open = true/);
  assert.match(cityPage, /Evidence ledger/);
  assert.match(cityPage, /Retrieved \{note\.retrievedAt\}/);
  assert.match(cityPage, /\(note\.sources \?\? \[\]\)\.map/);
  assert.match(curatedIndex, /const collectPayloads = Object\.fromEntries/);
  assert.match(curatedIndex, /type: isLocalResearch \? 'local-research' : 'curated'/);
  assert.match(curatedIndex, /places: saveablePlaces\.map/);
  assert.match(curatedIndex, /collectPayloads\[button\.dataset\.curatedCollect\]/);
  assert.match(profilePage, /map-ready pin/);
  assert.match(profilePage, /Open saved AMap pin/);
  assert.match(profilePage, /Open saved Apple pin/);
  assert.match(mapComponent, /data-resolution=\{isLocalResearch \? cell\.resolutionState : undefined\}/);
  assert.match(mapComponent, /mapReadyCount.*map-ready/s);
  assert.match(mapComponent, /reviewCount.*needs review/s);
  assert.match(mapComponent, /data-local-grid-place/);
  assert.match(mapComponent, /Local candidate resolution grid/);
});

test('direct resident testimony is not inferred from official or community-program sources', () => {
  const residentDirect = shanghaiLocalUseCollection.candidates.filter((candidate) => candidate.evidenceGrade === 'resident-direct');
  assert.deepEqual(residentDirect.map((candidate) => candidate.id), ['green-hill-local-use']);
  assert.ok(residentDirect[0].sources.some((source) => source.type === 'resident-reporting'));
  assert.ok(shanghaiLocalUseCollection.candidates
    .filter((candidate) => candidate.evidenceGrade !== 'resident-direct')
    .every((candidate) => !candidate.evidenceLabel.toLowerCase().includes('direct resident')));
});
