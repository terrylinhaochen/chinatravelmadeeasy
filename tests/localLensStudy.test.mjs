import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCAL_LENS_MAX_BASELINE,
  createLocalLensRecord,
  normalizeBaselineSelection,
  seededRank,
  summarizeLocalLensStudy,
} from '../src/utils/localLensStudy.js';
import { baselineCandidates, localLanguageCandidates, localLensStudyVersion } from '../src/data/localLensShanghai.js';

test('Shanghai Local Lens keeps two balanced ten-candidate sets', () => {
  assert.equal(baselineCandidates.length, 10);
  assert.equal(localLanguageCandidates.length, 10);
  assert.equal(new Set([...baselineCandidates, ...localLanguageCandidates].map((item) => item.id)).size, 20);
  assert.ok(localLanguageCandidates.every((item) => item.originalName && item.sourceUrl && item.mapStatus));
});
test('baseline normalization deduplicates, validates, and caps selections', () => {
  const validIds = baselineCandidates.map((item) => item.id);
  const selected = normalizeBaselineSelection([...validIds, validIds[0], 'unknown'], validIds);
  assert.equal(selected.length, LOCAL_LENS_MAX_BASELINE);
  assert.deepEqual(selected, validIds.slice(0, LOCAL_LENS_MAX_BASELINE));
});

test('decision summary distinguishes itinerary changes from curiosity', () => {
  const summary = summarizeLocalLensStudy({
    baselineKeptIds: ['north-bund', 'west-bund'],
    treatmentDecisions: {
      'green-hill': 'add',
      'soap-dream-space': 'maybe',
      'fuxing-island-park': 'replace',
      'huoshan-road': 'not-for-me',
    },
    replaceTargets: { 'fuxing-island-park': 'west-bund' },
  });

  assert.equal(summary.changedPlan, true);
  assert.equal(summary.decisionChangingCount, 2);
  assert.equal(summary.counts.maybe, 1);
  assert.deepEqual(summary.missingReplaceTargets, []);
});

test('replacement decisions require a named target', () => {
  const summary = summarizeLocalLensStudy({
    treatmentDecisions: { 'green-hill': 'replace' },
  });
  assert.deepEqual(summary.missingReplaceTargets, ['green-hill']);
});

test('study records preserve the blind choice and produce stable seeded ordering', () => {
  const input = {
    studyVersion: localLensStudyVersion,
    sessionId: 'study-123',
    profile: { base: 'Jing\'an', interests: ['food'] },
    baselineKeptIds: ['north-bund'],
    treatmentDecisions: { 'green-hill': 'add' },
    replaceTargets: {},
  };
  const record = createLocalLensRecord(input, new Date('2026-07-14T12:00:00.000Z'));

  assert.equal(record.summary.changedPlan, true);
  assert.equal(record.completedAt, '2026-07-14T12:00:00.000Z');
  assert.equal(seededRank('green-hill', 'abc'), seededRank('green-hill', 'abc'));
  assert.notEqual(seededRank('green-hill', 'abc'), seededRank('green-hill', 'xyz'));
});
