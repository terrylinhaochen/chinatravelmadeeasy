import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCAL_LENS_MAX_BASELINE,
  aggregateLocalLensRecords,
  createLocalLensRecord,
  normalizeBaselineSelection,
  seededRank,
  summarizeLocalLensStudy,
  validateLocalLensRecord,
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

function completedRecord({
  sessionId,
  completedAt,
  addId,
  replaceId,
  counterfactual = 'probably-not',
  confidence = 4,
} = {}) {
  const treatmentDecisions = Object.fromEntries(localLanguageCandidates.map((candidate) => [candidate.id, 'not-for-me']));
  if (addId) treatmentDecisions[addId] = 'add';
  if (replaceId) treatmentDecisions[replaceId] = 'replace';
  return {
    studyVersion: localLensStudyVersion,
    sessionId,
    destination: 'Shanghai',
    profile: { base: 'Jing\'an', days: '3', interests: ['food'] },
    baselineKeptIds: ['north-bund'],
    treatmentDecisions,
    replaceTargets: replaceId ? { [replaceId]: 'set-one:north-bund' } : {},
    feedback: { counterfactual, confidence, reasons: ['more-specific'] },
    completedAt,
  };
}

test('completed study validation rejects partial treatment responses', () => {
  const record = completedRecord({
    sessionId: 'complete-1',
    completedAt: '2026-07-14T13:00:00.000Z',
    addId: 'green-hill',
  });
  delete record.treatmentDecisions['soap-dream-space'];

  const result = validateLocalLensRecord(record, {
    studyVersion: localLensStudyVersion,
    treatmentIds: localLanguageCandidates.map((candidate) => candidate.id),
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /treatment decisions missing: soap-dream-space/);
});

test('pilot aggregation deduplicates sessions and separates attributable novelty', () => {
  const firstDraft = completedRecord({
    sessionId: 'participant-1',
    completedAt: '2026-07-14T13:00:00.000Z',
    addId: 'green-hill',
  });
  const revisedDraft = completedRecord({
    sessionId: 'participant-1',
    completedAt: '2026-07-14T13:05:00.000Z',
    addId: 'green-hill',
    replaceId: 'soap-dream-space',
  });
  const unchanged = completedRecord({
    sessionId: 'participant-2',
    completedAt: '2026-07-14T14:00:00.000Z',
    counterfactual: 'probably-yes',
    confidence: 3,
  });
  const report = aggregateLocalLensRecords([firstDraft, revisedDraft, unchanged], {
    studyVersion: localLensStudyVersion,
    treatmentIds: localLanguageCandidates.map((candidate) => candidate.id),
  });

  assert.equal(report.participants, 2);
  assert.equal(report.duplicatesDropped, 1);
  assert.equal(report.changedPlanCount, 1);
  assert.equal(report.decisionChangeRate, 0.5);
  assert.equal(report.decisionTotals.add, 1);
  assert.equal(report.decisionTotals.replace, 1);
  assert.equal(report.counterfactualNoveltyCount, 1);
  assert.equal(report.counterfactualAmongChangedRate, 1);
  assert.equal(report.averageConfidence, 3.5);
});
