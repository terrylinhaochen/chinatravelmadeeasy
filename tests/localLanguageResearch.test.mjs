import assert from 'node:assert/strict';
import test from 'node:test';
import { localLanguageCandidates } from '../src/data/localLensShanghai.js';
import {
  localResearchStages,
  shanghaiNativeQueries,
  sourceAdapterState,
  summarizeAgentResearch,
  validateAgentResearchCandidate,
} from '../src/utils/localLanguageResearch.js';

test('agent research keeps retrieval, explanation, and resolution as separate stages', () => {
  assert.deepEqual(localResearchStages.map((stage) => stage.id), ['query', 'retrieve', 'explain', 'resolve']);
  assert.ok(shanghaiNativeQueries.every((query) => /[\u3400-\u9fff]/.test(query)));
});

test('every Shanghai research candidate preserves evidence and map state', () => {
  const checks = localLanguageCandidates.map(validateAgentResearchCandidate);
  assert.equal(checks.every((check) => check.valid), true, checks.flatMap((check) => check.errors).join('; '));
  assert.deepEqual(summarizeAgentResearch(localLanguageCandidates), {
    candidateCount: 10,
    sourceCount: 2,
    states: { resolved: 1, probable: 8, unresolved: 1 },
    autoSaveCount: 1,
    needsReviewCount: 9,
  });
});

test('local-platform availability is stated rather than inferred', () => {
  const adapters = Object.fromEntries(sourceAdapterState().map((adapter) => [adapter.name, adapter.state]));
  assert.equal(adapters['Chinese local web'], 'reviewed');
  assert.equal(adapters.Xiaohongshu, 'not-connected');
  assert.equal(adapters.Dianping, 'planned');
});
