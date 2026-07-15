import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCAL_LENS_MAX_BASELINE,
  aggregateLocalLensRecords,
  classifyLocalLensEligibility,
  createLocalLensRecord,
  normalizeLocalLensRecruitmentSource,
  normalizeBaselineSelection,
  seededRank,
  summarizeLocalLensStudy,
  validateLocalLensRecord,
} from '../src/utils/localLensStudy.js';
import { buildLocalLensHandoff, validateLocalLensProviderMatch } from '../src/utils/localLensHandoff.js';
import { buildKoreaLocalLensHandoff, validateKoreaLocalLensProviderMatch } from '../src/utils/localLensKoreaHandoff.js';
import { baselineCandidates, localLanguageCandidates, localLensStudyVersion } from '../src/data/localLensShanghai.js';
import {
  localLensSeoulStudyVersion,
  seoulBaselineCandidates,
  seoulLocalLanguageCandidates,
} from '../src/data/localLensSeoul.js';

test('Shanghai Local Lens keeps two balanced ten-candidate sets', () => {
  assert.equal(baselineCandidates.length, 10);
  assert.equal(localLanguageCandidates.length, 10);
  assert.equal(new Set([...baselineCandidates, ...localLanguageCandidates].map((item) => item.id)).size, 20);
  assert.ok(localLanguageCandidates.every((item) => item.originalName && item.sourceUrl && item.mapStatus));
});

test('provider audit applies one rubric to every treatment candidate', () => {
  const validations = localLanguageCandidates.map(validateLocalLensProviderMatch);
  assert.equal(validations.every((result) => result.valid), true, validations.flatMap((result) => result.errors).join('; '));
  assert.equal(localLanguageCandidates.filter((candidate) => candidate.providerMatch.state === 'resolved').length, 1);
  assert.equal(localLanguageCandidates.filter((candidate) => candidate.providerMatch.state === 'probable').length, 8);
  assert.equal(localLanguageCandidates.filter((candidate) => candidate.providerMatch.state === 'unresolved').length, 1);
  assert.equal(localLanguageCandidates.filter((candidate) => candidate.providerMatch.kind === 'route').length, 4);
});

test('only two-provider place agreement is eligible for automatic save', () => {
  const fuxing = localLanguageCandidates.find((candidate) => candidate.id === 'fuxing-island-park');
  const wharf = localLanguageCandidates.find((candidate) => candidate.id === 'qinhuangdao-wharf-station');
  const route = localLanguageCandidates.find((candidate) => candidate.id === 'yuyuan-segment');
  const unbounded = localLanguageCandidates.find((candidate) => candidate.id === 'huoshan-road');

  assert.equal(buildLocalLensHandoff(fuxing).canAutoSave, true);
  assert.match(buildLocalLensHandoff(fuxing).links[0].url, /B00154DQQ7/);
  assert.equal(buildLocalLensHandoff(wharf).canAutoSave, false);
  assert.equal(buildLocalLensHandoff(wharf).links.length, 3);
  assert.match(buildLocalLensHandoff(route).statusLabel, /Bounded route/);
  assert.equal(buildLocalLensHandoff(route).links.length, 3);
  assert.match(buildLocalLensHandoff(unbounded).statusLabel, /Not map-ready/);
});

test('Seoul Local Lens keeps two balanced eight-candidate sets', () => {
  assert.equal(seoulBaselineCandidates.length, 8);
  assert.equal(seoulLocalLanguageCandidates.length, 8);
  assert.equal(new Set([...seoulBaselineCandidates, ...seoulLocalLanguageCandidates].map((item) => item.id)).size, 16);
  assert.ok(seoulLocalLanguageCandidates.every((item) => item.originalName && item.sourceUrl && item.mapStatus));
});

test('Seoul applies the same provider rubric without pretending search links are resolved identities', () => {
  const validations = seoulLocalLanguageCandidates.map(validateKoreaLocalLensProviderMatch);
  assert.equal(validations.every((result) => result.valid), true, validations.flatMap((result) => result.errors).join('; '));
  assert.equal(seoulLocalLanguageCandidates.filter((candidate) => candidate.providerMatch.state === 'resolved').length, 0);
  assert.equal(seoulLocalLanguageCandidates.filter((candidate) => candidate.providerMatch.state === 'probable').length, 7);
  assert.equal(seoulLocalLanguageCandidates.filter((candidate) => candidate.providerMatch.state === 'unresolved').length, 1);
  assert.equal(seoulLocalLanguageCandidates.filter((candidate) => candidate.providerMatch.kind === 'route').length, 6);
  assert.ok(seoulLocalLanguageCandidates.every((candidate) => buildKoreaLocalLensHandoff(candidate).canAutoSave === false));
});

test('Korean provider handoffs use Naver and Kakao rather than a China-specific map', () => {
  const route = seoulLocalLanguageCandidates.find((candidate) => candidate.id === 'seonyudo-mangwon');
  const place = seoulLocalLanguageCandidates.find((candidate) => candidate.id === 'mangwoo-history-park');
  const routeHandoff = buildKoreaLocalLensHandoff(route);
  const placeHandoff = buildKoreaLocalLensHandoff(place);

  assert.equal(routeHandoff.links.length, 5);
  assert.match(routeHandoff.links[0].url, /map\.naver\.com/);
  assert.match(routeHandoff.links[2].url, /map\.kakao\.com/);
  assert.equal(placeHandoff.links.length, 3);
  assert.doesNotMatch(placeHandoff.links.map((link) => link.url).join(' '), /amap/i);
});

test('study records preserve the configured destination for cross-city analysis', () => {
  const record = createLocalLensRecord({
    studyVersion: localLensSeoulStudyVersion,
    destination: 'Seoul',
    sessionId: 'seoul-study-123',
    profile: { base: 'Jongno', interests: ['history'] },
    baselineKeptIds: ['seongbuk-dong'],
    treatmentDecisions: { 'seongbuk-cultural-walk': 'add' },
    replaceTargets: {},
  }, new Date('2026-07-15T12:00:00.000Z'));

  assert.equal(record.destination, 'Seoul');
  assert.equal(record.studyVersion, localLensSeoulStudyVersion);
  assert.equal(record.summary.changedPlan, true);
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

test('primary cohort requires a real trip window, limited destination-language comfort, and an existing draft', () => {
  const eligible = classifyLocalLensEligibility({
    tripStatus: 'planning-six-months',
    languageComfort: 'basic',
    existingStops: ['The Bund', 'Shanghai Museum', 'Jing\'an Temple'],
  });
  const exploratory = classifyLocalLensEligibility({
    tripStatus: 'general-inspiration',
    languageComfort: 'fluent',
    existingStops: ['The Bund'],
  });

  assert.equal(eligible.eligible, true);
  assert.deepEqual(eligible.reasons, []);
  assert.equal(exploratory.eligible, false);
  assert.deepEqual(exploratory.reasons, [
    'outside-real-trip-window',
    'comfortable-in-destination-language',
    'fewer-than-three-existing-stops',
  ]);
});

test('recruitment attribution is anonymous, bounded, and stable', () => {
  assert.equal(normalizeLocalLensRecruitmentSource(' Reddit / KoreaTravel '), 'reddit-koreatravel');
  assert.equal(normalizeLocalLensRecruitmentSource(''), 'direct');
  assert.equal(normalizeLocalLensRecruitmentSource('A'.repeat(100)).length, 64);
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
    profile: {
      base: 'Jing\'an',
      days: '3',
      interests: ['food'],
      tripStatus: 'planning-six-months',
      languageComfort: 'none',
      existingStops: ['The Bund', 'Shanghai Museum', 'Jing\'an Temple'],
      recruitmentSource: 'reddit-travelchina',
    },
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
  assert.equal(report.eligibleParticipants, 2);
  assert.equal(report.ineligibleParticipants, 0);
  assert.equal(report.duplicatesDropped, 1);
  assert.equal(report.changedPlanCount, 1);
  assert.equal(report.decisionChangeRate, 0.5);
  assert.equal(report.decisionTotals.add, 1);
  assert.equal(report.decisionTotals.replace, 1);
  assert.equal(report.counterfactualNoveltyCount, 1);
  assert.equal(report.counterfactualAmongChangedRate, 1);
  assert.equal(report.averageConfidence, 3.5);
  assert.deepEqual(report.recruitmentSourceCounts, { 'reddit-travelchina': 2 });
});

test('pilot aggregation keeps exploratory records but excludes them from the primary outcome', () => {
  const eligible = completedRecord({
    sessionId: 'eligible-participant',
    completedAt: '2026-07-14T15:00:00.000Z',
    addId: 'green-hill',
  });
  const exploratory = completedRecord({
    sessionId: 'exploratory-participant',
    completedAt: '2026-07-14T16:00:00.000Z',
  });
  exploratory.profile.tripStatus = 'general-inspiration';
  exploratory.profile.languageComfort = 'fluent';
  exploratory.profile.existingStops = [];

  const report = aggregateLocalLensRecords([eligible, exploratory], {
    studyVersion: localLensStudyVersion,
    treatmentIds: localLanguageCandidates.map((candidate) => candidate.id),
  });

  assert.equal(report.participants, 2);
  assert.equal(report.eligibleParticipants, 1);
  assert.equal(report.ineligibleParticipants, 1);
  assert.equal(report.changedPlanCount, 1);
  assert.equal(report.decisionChangeRate, 1);
  assert.deepEqual(report.eligibilityReasonCounts, {
    'outside-real-trip-window': 1,
    'comfortable-in-destination-language': 1,
    'fewer-than-three-existing-stops': 1,
  });
});
