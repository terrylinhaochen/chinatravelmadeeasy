import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { aggregateLocalLensRecords } from '../src/utils/localLensStudy.js';
import { localLanguageCandidates, localLensStudyVersion } from '../src/data/localLensShanghai.js';

const candidateIds = localLanguageCandidates.map((candidate) => candidate.id);
const candidateNames = new Map(localLanguageCandidates.map((candidate) => [candidate.id, candidate.name]));
const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const files = args.filter((argument) => argument !== '--json');

if (!files.length) {
  console.error('Usage: node pipeline/analyze_local_lens_results.mjs [--json] result.json [more-results.json]');
  process.exitCode = 1;
} else {
  const records = [];
  const parseErrors = [];

  for (const file of files) {
    try {
      records.push(...parseResultFile(await readFile(resolve(file), 'utf8')));
    } catch (error) {
      parseErrors.push({ file, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const report = aggregateLocalLensRecords(records, {
    studyVersion: localLensStudyVersion,
    treatmentIds: candidateIds,
  });
  const output = { studyVersion: localLensStudyVersion, sourceFiles: files, parseErrors, ...report };
  if (jsonOutput) console.log(JSON.stringify(output, null, 2));
  else console.log(formatPilotReport(output));
  if (!report.participants) process.exitCode = 2;
}

export function parseResultFile(source) {
  const trimmed = source.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.records)) return parsed.records;
    return [parsed];
  } catch {
    return trimmed.split(/\r?\n/).filter(Boolean).map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`invalid JSON on line ${index + 1}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  }
}

export function formatPilotReport(report) {
  const pct = (value) => value == null ? 'n/a' : `${(value * 100).toFixed(1)}%`;
  const decimal = (value) => value == null ? 'n/a' : value.toFixed(2);
  const topCandidates = Object.entries(report.candidateCounts)
    .map(([id, counts]) => ({ id, name: candidateNames.get(id) || id, ...counts, changes: counts.add + counts.replace }))
    .sort((left, right) => right.changes - left.changes || right.add - left.add || left.name.localeCompare(right.name))
    .slice(0, 10);
  const reasons = Object.entries(report.reasonCounts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const pilotGate = report.participants < 20
    ? `Directional only: recruit ${20 - report.participants} more participant${20 - report.participants === 1 ? '' : 's'} before applying the pilot falsification threshold.`
    : report.decisionChangeRate < 0.15
      ? 'Falsification signal: decision-change rate is below the pre-registered 15% threshold.'
      : 'The decision-change rate clears the pre-registered 15% pilot threshold; provider handoff and later-trip behavior still need validation.';

  return [
    '# Shanghai Local Lens pilot readout',
    '',
    `Study version: ${report.studyVersion}`,
    `Valid participants: ${report.participants}`,
    `Rejected records: ${report.rejected.length}`,
    `Duplicate sessions removed: ${report.duplicatesDropped}`,
    `Unreadable files: ${report.parseErrors.length}`,
    '',
    '## Primary evidence',
    '',
    `- Decision-change rate: ${pct(report.decisionChangeRate)} (${report.changedPlanCount}/${report.participants})`,
    `- Replacement participant rate: ${pct(report.replaceParticipantRate)}`,
    `- Mean add-or-replace decisions per participant: ${decimal(report.meanDecisionChangingPlaces)}`,
    `- Counterfactual novelty rate: ${pct(report.counterfactualNoveltyRate)} (${report.counterfactualNoveltyCount}/${report.participants})`,
    `- Counterfactual novelty among changed plans: ${pct(report.counterfactualAmongChangedRate)}`,
    `- Average revised-plan confidence: ${decimal(report.averageConfidence)} / 5`,
    '',
    `**Interpretation gate:** ${pilotGate}`,
    '',
    '“Counterfactual novelty” counts only participants who both changed the plan and said the place probably or definitely would not have entered without the second set.',
    '',
    '## Decisions',
    '',
    `- Add: ${report.decisionTotals.add}`,
    `- Replace: ${report.decisionTotals.replace}`,
    `- Maybe: ${report.decisionTotals.maybe}`,
    `- Not for me: ${report.decisionTotals['not-for-me']}`,
    '',
    '## Candidate-level changes',
    '',
    '| Candidate | Add | Replace | Maybe | Not for me |',
    '| --- | ---: | ---: | ---: | ---: |',
    ...topCandidates.map((candidate) => `| ${candidate.name} | ${candidate.add} | ${candidate.replace} | ${candidate.maybe} | ${candidate['not-for-me']} |`),
    '',
    '## Reported reasons',
    '',
    ...(reasons.length ? reasons.map(([reason, count]) => `- ${reason}: ${count}`) : ['- No structured reasons submitted.']),
    '',
    ...(report.rejected.length ? [
      '## Rejected records',
      '',
      ...report.rejected.map((item) => `- Record ${item.index + 1}${item.sessionId ? ` (${item.sessionId})` : ''}: ${item.errors.join('; ')}`),
      '',
    ] : []),
    ...(report.parseErrors.length ? [
      '## Unreadable files',
      '',
      ...report.parseErrors.map((item) => `- ${item.file}: ${item.error}`),
      '',
    ] : []),
  ].join('\n');
}
