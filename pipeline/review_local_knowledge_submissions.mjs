import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { aggregateLocalKnowledgeSubmissions } from '../src/utils/localKnowledgeSubmission.js';

const args = process.argv.slice(2);
const jsonOutput = args.includes('--json');
const files = args.filter((argument) => argument !== '--json');

if (!files.length) {
  console.error('Usage: node pipeline/review_local_knowledge_submissions.mjs [--json] submission.json [more-submissions.json]');
  process.exitCode = 1;
} else {
  const records = [];
  const parseErrors = [];
  for (const file of files) {
    try {
      records.push(...parseSubmissionFile(await readFile(resolve(file), 'utf8')));
    } catch (error) {
      parseErrors.push({ file, error: error instanceof Error ? error.message : String(error) });
    }
  }

  const report = { ...aggregateLocalKnowledgeSubmissions(records), sourceFiles: files, parseErrors };
  if (jsonOutput) console.log(JSON.stringify(report, null, 2));
  else console.log(formatSubmissionReview(report));
  if (!report.accepted) process.exitCode = 2;
}

export function parseSubmissionFile(source) {
  const trimmed = source.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.submissions)) return parsed.submissions;
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

export function formatSubmissionReview(report) {
  const pct = (value) => value == null ? 'n/a' : `${(value * 100).toFixed(1)}%`;
  const listCounts = (counts) => Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([value, count]) => `${value}: ${count}`)
    .join(', ') || 'none';

  return [
    '# Local-knowledge contribution review',
    '',
    `Accepted unique records: ${report.accepted}`,
    `Duplicate evidence merged: ${report.duplicatesMerged}`,
    `Rejected records: ${report.rejected.length}`,
    `Unreadable files: ${report.parseErrors.length}`,
    `Local-map link coverage: ${pct(report.providerLinkCoverage)}`,
    `Languages: ${listCounts(report.byLanguage)}`,
    `Platforms: ${listCounts(report.byPlatform)}`,
    `Shapes: ${listCounts(report.byKind)}`,
    '',
    '## Review queue',
    '',
    '| City | Original name | Language | Source | Shape | Map identity | Submissions |',
    '| --- | --- | --- | --- | --- | --- | ---: |',
    ...report.reviewQueue.map((submission) => [
      submission.city,
      submission.originalName,
      submission.sourceLanguage,
      submission.sourcePlatform,
      submission.kind,
      submission.localMapUrl ? 'supplied' : 'missing',
      submission.submitCount,
    ].map((value) => String(value).replaceAll('|', '\\|')).join(' | ')).map((row) => `| ${row} |`),
    '',
    'Review order: preserve the original evidence, translate without changing the claim, identify place versus route, compare provider aliases and address, then publish or request a correction.',
    '',
    ...(report.rejected.length ? [
      '## Rejected records',
      '',
      ...report.rejected.map((item) => `- Record ${item.index + 1}${item.submissionId ? ` (${item.submissionId})` : ''}: ${item.errors.join('; ')}`),
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
