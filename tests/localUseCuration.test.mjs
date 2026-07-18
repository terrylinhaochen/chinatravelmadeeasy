import { strict as assert } from 'node:assert';
import test from 'node:test';
import {
  shanghaiLocalUseCollection,
  summarizeShanghaiLocalUse,
  validateShanghaiLocalUseCandidate,
} from '../src/data/shanghaiLocalUse.js';

test('the Yangpu collection publishes a small, source-backed local-use slice', () => {
  const summary = summarizeShanghaiLocalUse();
  assert.deepEqual(summary, {
    candidateCount: 4,
    directResidentCount: 1,
    resolvedCount: 1,
    sourceCount: 6,
  });
  assert.equal(shanghaiLocalUseCollection.sourceAccess.chineseLocalWeb, 'reviewed');
  assert.equal(shanghaiLocalUseCollection.sourceAccess.xiaohongshu, 'not-connected');
  assert.equal(shanghaiLocalUseCollection.sourceAccess.dianping, 'not-connected');
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

test('direct resident testimony is not inferred from official or community-program sources', () => {
  const residentDirect = shanghaiLocalUseCollection.candidates.filter((candidate) => candidate.evidenceGrade === 'resident-direct');
  assert.deepEqual(residentDirect.map((candidate) => candidate.id), ['green-hill-local-use']);
  assert.ok(residentDirect[0].sources.some((source) => source.type === 'resident-reporting'));
  assert.ok(shanghaiLocalUseCollection.candidates
    .filter((candidate) => candidate.evidenceGrade !== 'resident-direct')
    .every((candidate) => !candidate.evidenceLabel.toLowerCase().includes('direct resident')));
});
