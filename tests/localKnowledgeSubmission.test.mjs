import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCAL_KNOWLEDGE_SUBMISSION_VERSION,
  aggregateLocalKnowledgeSubmissions,
  canonicalizeContributionUrl,
  createLocalKnowledgeSubmission,
  inferContributionPlatform,
  localKnowledgeReviewChecklist,
  localKnowledgeSubmissionKey,
  validateLocalKnowledgeSubmission,
} from '../src/utils/localKnowledgeSubmission.js';

const baseInput = {
  city: 'Shanghai',
  sourceLanguage: 'zh-CN',
  sourcePlatform: 'xiaohongshu',
  sourceUrl: 'https://www.xiaohongshu.com/explore/abc123?utm_source=share',
  kind: 'place',
  originalName: '绿之丘',
  evidenceText: '沿着杨浦滨江走到绿之丘，可以上到屋顶看江景。',
  whyItMatters: 'It adds a specific industrial-riverfront stop and explains why it belongs in the walk.',
  personalContext: 'source-only',
  localMapUrl: 'https://maps.apple.com/?q=%E7%BB%BF%E4%B9%8B%E4%B8%98',
  rightsConsent: true,
};

test('creates a reviewer-ready Chinese local-source submission without identity fields', () => {
  const submission = createLocalKnowledgeSubmission(baseInput, new Date('2026-07-14T18:00:00.000Z'));
  assert.equal(submission.version, LOCAL_KNOWLEDGE_SUBMISSION_VERSION);
  assert.equal(submission.sourceUrl, 'https://www.xiaohongshu.com/explore/abc123');
  assert.equal(submission.createdAt, '2026-07-14T18:00:00.000Z');
  assert.equal(validateLocalKnowledgeSubmission(submission).valid, true);
  assert.equal('email' in submission, false);
  assert.equal(submission.review.providerResolution, 'pending');
});

test('accepts a Korean route only when both endpoints are preserved', () => {
  const route = createLocalKnowledgeSubmission({
    ...baseInput,
    city: 'Seoul',
    sourceLanguage: 'ko',
    sourcePlatform: 'local-publication',
    sourceUrl: 'https://example.kr/seoul/walk?utm_campaign=share',
    kind: 'route',
    originalName: '서촌 골목길 산책',
    routeStart: '경복궁역 2번 출구',
    routeEnd: '수성동계곡',
    localMapUrl: '',
  });
  assert.equal(validateLocalKnowledgeSubmission(route).valid, true);
  route.routeEnd = '';
  assert.match(validateLocalKnowledgeSubmission(route).errors.join(' '), /routeEnd/);
});

test('rejects private URLs, mismatched social hosts, and unsupported map links', () => {
  assert.equal(canonicalizeContributionUrl('http://127.0.0.1/private'), '');
  const mismatch = createLocalKnowledgeSubmission({ ...baseInput, sourceUrl: 'https://example.com/post' });
  assert.match(validateLocalKnowledgeSubmission(mismatch).errors.join(' '), /does not match xiaohongshu/);
  const badMap = createLocalKnowledgeSubmission({ ...baseInput, localMapUrl: 'https://example.com/map' });
  assert.match(validateLocalKnowledgeSubmission(badMap).errors.join(' '), /supported map provider/);
});

test('canonical source identity deduplicates tracking variants', () => {
  const first = localKnowledgeSubmissionKey(baseInput);
  const second = localKnowledgeSubmissionKey({
    ...baseInput,
    sourceUrl: 'https://www.xiaohongshu.com/explore/abc123?utm_medium=copy_link#comments',
  });
  assert.equal(first, second);
  assert.equal(inferContributionPlatform(baseInput.sourceUrl), 'xiaohongshu');
});

test('review checklist keeps provider identity separate from content completeness', () => {
  const submission = createLocalKnowledgeSubmission({ ...baseInput, localMapUrl: '' });
  const checklist = localKnowledgeReviewChecklist(submission);
  assert.equal(checklist.valid, true);
  assert.equal(checklist.checks.find((check) => check.id === 'provider').ready, false);
  assert.equal(checklist.checks.find((check) => check.id === 'original-evidence').ready, true);
});

test('review queue merges duplicate evidence without collapsing different places from one post', () => {
  const first = createLocalKnowledgeSubmission(baseInput, new Date('2026-07-14T18:00:00.000Z'));
  const duplicate = createLocalKnowledgeSubmission({
    ...baseInput,
    evidenceText: '绿之丘适合接在杨浦滨江散步路线里。',
  }, new Date('2026-07-14T18:05:00.000Z'));
  const secondPlace = createLocalKnowledgeSubmission({
    ...baseInput,
    originalName: '皂梦空间',
    evidenceText: '从绿之丘继续走到皂梦空间。',
  }, new Date('2026-07-14T18:10:00.000Z'));
  const report = aggregateLocalKnowledgeSubmissions([first, duplicate, secondPlace]);

  assert.equal(report.accepted, 2);
  assert.equal(report.duplicatesMerged, 1);
  assert.equal(report.providerLinkCoverage, 1);
  assert.equal(report.reviewQueue.find((item) => item.originalName === '绿之丘').submitCount, 2);
  assert.equal(report.reviewQueue.find((item) => item.originalName === '绿之丘').evidenceVariants.length, 2);
});
