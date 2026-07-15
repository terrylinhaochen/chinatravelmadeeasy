export const LOCAL_LENS_MAX_BASELINE = 5;
export const LOCAL_LENS_DECISIONS = ['add', 'replace', 'maybe', 'not-for-me'];
export const LOCAL_LENS_PRIMARY_TRIP_STATUSES = ['planning-six-months', 'returned-three-months'];
export const LOCAL_LENS_PRIMARY_LANGUAGE_LEVELS = ['none', 'basic'];
export const LOCAL_LENS_MIN_EXISTING_STOPS = 3;

export function classifyLocalLensEligibility(profile = {}) {
  const reasons = [];
  const tripStatus = String(profile.tripStatus || '');
  const languageComfort = String(profile.languageComfort || '');
  const existingStopCount = Array.isArray(profile.existingStops) ? profile.existingStops.length : 0;

  if (!LOCAL_LENS_PRIMARY_TRIP_STATUSES.includes(tripStatus)) reasons.push('outside-real-trip-window');
  if (!LOCAL_LENS_PRIMARY_LANGUAGE_LEVELS.includes(languageComfort)) reasons.push('comfortable-in-destination-language');
  if (existingStopCount < LOCAL_LENS_MIN_EXISTING_STOPS) reasons.push('fewer-than-three-existing-stops');

  return {
    eligible: reasons.length === 0,
    reasons,
    tripStatus,
    languageComfort,
    existingStopCount,
  };
}

export function seededRank(value, seed) {
  const input = `${seed}:${value}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
export function normalizeBaselineSelection(ids, validIds = []) {
  const allowed = new Set(validIds);
  return [...new Set(ids)]
    .filter((id) => allowed.size === 0 || allowed.has(id))
    .slice(0, LOCAL_LENS_MAX_BASELINE);
}

export function summarizeLocalLensStudy({ baselineKeptIds = [], treatmentDecisions = {}, replaceTargets = {} } = {}) {
  const counts = Object.fromEntries(LOCAL_LENS_DECISIONS.map((decision) => [decision, 0]));
  const answeredIds = [];
  const invalidIds = [];

  Object.entries(treatmentDecisions).forEach(([id, decision]) => {
    if (!LOCAL_LENS_DECISIONS.includes(decision)) {
      invalidIds.push(id);
      return;
    }
    counts[decision] += 1;
    answeredIds.push(id);
  });

  const missingReplaceTargets = answeredIds.filter(
    (id) => treatmentDecisions[id] === 'replace' && !String(replaceTargets[id] || '').trim(),
  );

  return {
    baselineKeptCount: new Set(baselineKeptIds).size,
    answeredCount: answeredIds.length,
    counts,
    changedPlan: counts.add + counts.replace > 0,
    decisionChangingCount: counts.add + counts.replace,
    missingReplaceTargets,
    invalidIds,
  };
}

export function createLocalLensRecord(input, now = new Date()) {
  const summary = summarizeLocalLensStudy(input);
  const profile = input.profile || {};
  return {
    studyVersion: input.studyVersion,
    sessionId: input.sessionId,
    destination: String(input.destination || 'Shanghai'),
    profile,
    eligibility: classifyLocalLensEligibility(profile),
    baselineKeptIds: [...new Set(input.baselineKeptIds || [])],
    treatmentDecisions: { ...(input.treatmentDecisions || {}) },
    replaceTargets: { ...(input.replaceTargets || {}) },
    summary,
    feedback: input.feedback || null,
    completedAt: now.toISOString(),
  };
}

export function validateLocalLensRecord(record, {
  studyVersion,
  treatmentIds = [],
} = {}) {
  const errors = [];
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return { valid: false, errors: ['record must be an object'], summary: null };
  }

  if (!String(record.sessionId || '').trim()) errors.push('sessionId is required');
  if (!String(record.studyVersion || '').trim()) errors.push('studyVersion is required');
  if (studyVersion && record.studyVersion !== studyVersion) errors.push(`unexpected studyVersion: ${record.studyVersion || 'missing'}`);
  if (!record.completedAt || Number.isNaN(Date.parse(record.completedAt))) errors.push('completedAt must be a valid date');
  if (!Array.isArray(record.baselineKeptIds)) errors.push('baselineKeptIds must be an array');
  if ((record.baselineKeptIds || []).length > LOCAL_LENS_MAX_BASELINE) errors.push(`baselineKeptIds cannot exceed ${LOCAL_LENS_MAX_BASELINE}`);

  const decisions = record.treatmentDecisions;
  if (!decisions || typeof decisions !== 'object' || Array.isArray(decisions)) {
    errors.push('treatmentDecisions must be an object');
  }

  const summary = summarizeLocalLensStudy({
    baselineKeptIds: record.baselineKeptIds || [],
    treatmentDecisions: decisions || {},
    replaceTargets: record.replaceTargets || {},
  });
  if (summary.invalidIds.length) errors.push(`invalid decisions: ${summary.invalidIds.join(', ')}`);
  if (summary.missingReplaceTargets.length) errors.push(`replacement targets missing: ${summary.missingReplaceTargets.join(', ')}`);

  if (treatmentIds.length) {
    const expected = new Set(treatmentIds);
    const received = new Set(Object.keys(decisions || {}));
    const missing = treatmentIds.filter((id) => !received.has(id));
    const unknown = [...received].filter((id) => !expected.has(id));
    if (missing.length) errors.push(`treatment decisions missing: ${missing.join(', ')}`);
    if (unknown.length) errors.push(`unknown treatment candidates: ${unknown.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    summary,
    eligibility: classifyLocalLensEligibility(record.profile || {}),
  };
}

export function aggregateLocalLensRecords(records, options = {}) {
  const rejected = [];
  const latestBySession = new Map();
  let duplicatesDropped = 0;

  (Array.isArray(records) ? records : []).forEach((record, index) => {
    const validation = validateLocalLensRecord(record, options);
    if (!validation.valid) {
      rejected.push({ index, sessionId: record?.sessionId || null, errors: validation.errors });
      return;
    }

    const existing = latestBySession.get(record.sessionId);
    if (!existing || Date.parse(record.completedAt) > Date.parse(existing.completedAt)) {
      if (existing) duplicatesDropped += 1;
      latestBySession.set(record.sessionId, {
        ...record,
        summary: validation.summary,
        eligibility: validation.eligibility,
      });
    } else {
      duplicatesDropped += 1;
    }
  });

  const accepted = [...latestBySession.values()];
  const participants = accepted.length;
  const eligibleRecords = accepted.filter((record) => record.eligibility.eligible);
  const eligibleParticipants = eligibleRecords.length;
  const ineligibleParticipants = participants - eligibleParticipants;
  const eligibilityReasonCounts = {};
  accepted.filter((record) => !record.eligibility.eligible).forEach((record) => {
    record.eligibility.reasons.forEach((reason) => {
      eligibilityReasonCounts[reason] = (eligibilityReasonCounts[reason] || 0) + 1;
    });
  });
  const decisionTotals = Object.fromEntries(LOCAL_LENS_DECISIONS.map((decision) => [decision, 0]));
  const reasonCounts = {};
  const candidateCounts = Object.fromEntries((options.treatmentIds || []).map((id) => [id, {
    add: 0,
    replace: 0,
    maybe: 0,
    'not-for-me': 0,
  }]));
  let changedPlanCount = 0;
  let replaceParticipantCount = 0;
  let counterfactualNoveltyCount = 0;
  const confidenceValues = [];

  eligibleRecords.forEach((record) => {
    if (record.summary.changedPlan) changedPlanCount += 1;
    if (record.summary.counts.replace > 0) replaceParticipantCount += 1;
    LOCAL_LENS_DECISIONS.forEach((decision) => {
      decisionTotals[decision] += record.summary.counts[decision];
    });
    Object.entries(record.treatmentDecisions).forEach(([id, decision]) => {
      candidateCounts[id] ||= { add: 0, replace: 0, maybe: 0, 'not-for-me': 0 };
      candidateCounts[id][decision] += 1;
    });

    const counterfactual = record.feedback?.counterfactual;
    if (record.summary.changedPlan && ['definitely-not', 'probably-not'].includes(counterfactual)) counterfactualNoveltyCount += 1;
    const confidence = Number(record.feedback?.confidence);
    if (Number.isFinite(confidence) && confidence >= 1 && confidence <= 5) confidenceValues.push(confidence);
    (record.feedback?.reasons || []).forEach((reason) => {
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
  });

  const totalDecisionChanges = decisionTotals.add + decisionTotals.replace;
  return {
    participants,
    eligibleParticipants,
    ineligibleParticipants,
    eligibilityReasonCounts,
    changedPlanCount,
    decisionChangeRate: eligibleParticipants ? changedPlanCount / eligibleParticipants : null,
    replaceParticipantRate: eligibleParticipants ? replaceParticipantCount / eligibleParticipants : null,
    meanDecisionChangingPlaces: eligibleParticipants ? totalDecisionChanges / eligibleParticipants : null,
    counterfactualNoveltyCount,
    counterfactualNoveltyRate: eligibleParticipants ? counterfactualNoveltyCount / eligibleParticipants : null,
    counterfactualAmongChangedRate: changedPlanCount ? counterfactualNoveltyCount / changedPlanCount : null,
    averageConfidence: confidenceValues.length
      ? confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length
      : null,
    decisionTotals,
    reasonCounts,
    candidateCounts,
    duplicatesDropped,
    rejected,
    acceptedRecords: accepted,
    eligibleRecords,
  };
}
