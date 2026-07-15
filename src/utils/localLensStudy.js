export const LOCAL_LENS_MAX_BASELINE = 5;
export const LOCAL_LENS_DECISIONS = ['add', 'replace', 'maybe', 'not-for-me'];

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
  return {
    studyVersion: input.studyVersion,
    sessionId: input.sessionId,
    destination: 'Shanghai',
    profile: input.profile,
    baselineKeptIds: [...new Set(input.baselineKeptIds || [])],
    treatmentDecisions: { ...(input.treatmentDecisions || {}) },
    replaceTargets: { ...(input.replaceTargets || {}) },
    summary,
    feedback: input.feedback || null,
    completedAt: now.toISOString(),
  };
}
