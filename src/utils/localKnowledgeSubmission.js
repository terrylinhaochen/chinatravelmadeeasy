export const LOCAL_KNOWLEDGE_SUBMISSION_VERSION = 'ctme-local-knowledge-v1';
export const LOCAL_KNOWLEDGE_SOURCE_PLATFORMS = [
  'xiaohongshu',
  'dianping',
  'instagram',
  'tiktok',
  'local-map',
  'local-publication',
  'personal-knowledge',
  'other',
];
export const LOCAL_KNOWLEDGE_KINDS = ['place', 'route', 'unclear'];
export const LOCAL_KNOWLEDGE_CONTEXTS = ['source-only', 'planning', 'visited', 'local'];

const SOCIAL_HOSTS = {
  xiaohongshu: ['xiaohongshu.com', 'xhslink.com'],
  dianping: ['dianping.com'],
  instagram: ['instagram.com'],
  tiktok: ['tiktok.com'],
};
const MAP_HOSTS = [
  'amap.com',
  'gaode.com',
  'maps.apple.com',
  'map.baidu.com',
  'map.qq.com',
  'maps.google.com',
  'google.com',
  'maps.app.goo.gl',
];
const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

function hostMatches(hostname, allowed) {
  return allowed.some((host) => hostname === host || hostname.endsWith(`.${host}`));
}

function isPrivateHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.local') || host === '::1') return true;
  if (/^(127|10|0)\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) return true;
  const match = host.match(/^172\.(\d{1,3})\./);
  return Boolean(match && Number(match[1]) >= 16 && Number(match[1]) <= 31);
}

export function canonicalizeContributionUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || isPrivateHost(url.hostname)) return '';
    url.hostname = url.hostname.toLowerCase();
    url.hash = '';
    TRACKING_PARAMS.forEach((parameter) => url.searchParams.delete(parameter));
    if (!url.searchParams.size) url.search = '';
    return url.toString();
  } catch {
    return '';
  }
}

export function inferContributionPlatform(sourceUrl) {
  const canonical = canonicalizeContributionUrl(sourceUrl);
  if (!canonical) return '';
  const hostname = new URL(canonical).hostname;
  for (const [platform, hosts] of Object.entries(SOCIAL_HOSTS)) {
    if (hostMatches(hostname, hosts)) return platform;
  }
  if (hostMatches(hostname, MAP_HOSTS)) return 'local-map';
  return 'local-publication';
}

function fingerprint(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function localKnowledgeSubmissionKey(input) {
  const sourceUrl = canonicalizeContributionUrl(input.sourceUrl);
  const identity = [sourceUrl, input.sourceLanguage, input.city, input.originalName, input.kind, sourceUrl ? '' : input.evidenceText]
    .map((value) => String(value || '').trim().toLowerCase())
    .join('|');
  return `local-knowledge-${fingerprint(identity)}`;
}

export function createLocalKnowledgeSubmission(input, now = new Date()) {
  const sourceUrl = canonicalizeContributionUrl(input.sourceUrl);
  const localMapUrl = canonicalizeContributionUrl(input.localMapUrl);
  const sourcePlatform = String(input.sourcePlatform || inferContributionPlatform(sourceUrl) || '').trim();
  const normalized = {
    version: LOCAL_KNOWLEDGE_SUBMISSION_VERSION,
    submissionId: localKnowledgeSubmissionKey({ ...input, sourceUrl }),
    createdAt: now.toISOString(),
    city: String(input.city || '').trim(),
    sourceLanguage: String(input.sourceLanguage || '').trim().toLowerCase(),
    sourcePlatform,
    sourceUrl,
    kind: String(input.kind || 'unclear').trim(),
    originalName: String(input.originalName || '').trim(),
    evidenceText: String(input.evidenceText || '').trim(),
    whyItMatters: String(input.whyItMatters || '').trim(),
    personalContext: String(input.personalContext || '').trim(),
    localMapUrl,
    routeStart: String(input.routeStart || '').trim(),
    routeEnd: String(input.routeEnd || '').trim(),
    rightsConsent: input.rightsConsent === true,
    review: {
      languageDetection: 'pending',
      translation: 'pending',
      providerResolution: 'pending',
      publication: 'review',
    },
  };
  return normalized;
}

export function validateLocalKnowledgeSubmission(submission) {
  const errors = [];
  if (!submission || typeof submission !== 'object' || Array.isArray(submission)) {
    return { valid: false, errors: ['submission must be an object'] };
  }
  if (submission.version !== LOCAL_KNOWLEDGE_SUBMISSION_VERSION) errors.push('unexpected submission version');
  if (!String(submission.submissionId || '').trim()) errors.push('submissionId is required');
  if (submission.submissionId && submission.submissionId !== localKnowledgeSubmissionKey(submission)) errors.push('submissionId does not match canonical evidence identity');
  if (!submission.createdAt || Number.isNaN(Date.parse(submission.createdAt))) errors.push('createdAt must be a valid date');
  if (!String(submission.city || '').trim()) errors.push('city is required');
  if (!String(submission.sourceLanguage || '').trim()) errors.push('sourceLanguage is required');
  if (!LOCAL_KNOWLEDGE_SOURCE_PLATFORMS.includes(submission.sourcePlatform)) errors.push('sourcePlatform is invalid');
  if (!LOCAL_KNOWLEDGE_KINDS.includes(submission.kind)) errors.push('kind is invalid');
  if (!LOCAL_KNOWLEDGE_CONTEXTS.includes(submission.personalContext)) errors.push('personalContext is invalid');
  if (!String(submission.originalName || '').trim()) errors.push('originalName is required');
  if (!String(submission.whyItMatters || '').trim()) errors.push('whyItMatters is required');
  if (!submission.sourceUrl && !String(submission.evidenceText || '').trim()) errors.push('sourceUrl or evidenceText is required');
  if (submission.sourceUrl && !canonicalizeContributionUrl(submission.sourceUrl)) errors.push('sourceUrl must be a public HTTPS URL');
  if (submission.localMapUrl && !canonicalizeContributionUrl(submission.localMapUrl)) errors.push('localMapUrl must be a public HTTPS URL');
  if (submission.localMapUrl) {
    const hostname = new URL(submission.localMapUrl).hostname;
    if (!hostMatches(hostname, MAP_HOSTS)) errors.push('localMapUrl must use a supported map provider');
  }
  if (SOCIAL_HOSTS[submission.sourcePlatform] && submission.sourceUrl) {
    const hostname = new URL(submission.sourceUrl).hostname;
    if (!hostMatches(hostname, SOCIAL_HOSTS[submission.sourcePlatform])) errors.push(`sourceUrl does not match ${submission.sourcePlatform}`);
  }
  if (submission.kind === 'route') {
    if (!String(submission.routeStart || '').trim()) errors.push('routeStart is required for routes');
    if (!String(submission.routeEnd || '').trim()) errors.push('routeEnd is required for routes');
  }
  if (submission.rightsConsent !== true) errors.push('rightsConsent is required');
  if (String(submission.city || '').length > 100) errors.push('city is too long');
  if (String(submission.originalName || '').length > 160) errors.push('originalName is too long');
  if (String(submission.evidenceText || '').length > 2000) errors.push('evidenceText is too long');
  if (String(submission.whyItMatters || '').length > 500) errors.push('whyItMatters is too long');
  if (String(submission.routeStart || '').length > 160 || String(submission.routeEnd || '').length > 160) errors.push('route endpoint is too long');
  return { valid: errors.length === 0, errors };
}

export function aggregateLocalKnowledgeSubmissions(records) {
  const rejected = [];
  const grouped = new Map();
  let duplicatesMerged = 0;

  (Array.isArray(records) ? records : []).forEach((record, index) => {
    const validation = validateLocalKnowledgeSubmission(record);
    if (!validation.valid) {
      rejected.push({ index, submissionId: record?.submissionId || null, errors: validation.errors });
      return;
    }
    const existing = grouped.get(record.submissionId);
    if (!existing) {
      grouped.set(record.submissionId, { ...record, submitCount: 1, evidenceVariants: [record.evidenceText].filter(Boolean) });
      return;
    }
    duplicatesMerged += 1;
    existing.submitCount += 1;
    if (record.evidenceText && !existing.evidenceVariants.includes(record.evidenceText)) existing.evidenceVariants.push(record.evidenceText);
    if (Date.parse(record.createdAt) > Date.parse(existing.createdAt)) {
      grouped.set(record.submissionId, {
        ...record,
        submitCount: existing.submitCount,
        evidenceVariants: existing.evidenceVariants,
      });
    }
  });

  const reviewQueue = [...grouped.values()].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt));
  const countBy = (field) => reviewQueue.reduce((counts, submission) => {
    const value = submission[field] || 'unknown';
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});

  return {
    accepted: reviewQueue.length,
    rejected,
    duplicatesMerged,
    providerLinkCoverage: reviewQueue.length
      ? reviewQueue.filter((submission) => submission.localMapUrl).length / reviewQueue.length
      : null,
    byLanguage: countBy('sourceLanguage'),
    byPlatform: countBy('sourcePlatform'),
    byKind: countBy('kind'),
    reviewQueue,
  };
}

export function localKnowledgeReviewChecklist(submission) {
  const validation = validateLocalKnowledgeSubmission(submission);
  return {
    valid: validation.valid,
    errors: validation.errors,
    checks: [
      { id: 'original-evidence', label: 'Original-language evidence retained', ready: Boolean(submission.evidenceText || submission.sourceUrl) },
      { id: 'identity', label: 'Original name and city supplied', ready: Boolean(submission.originalName && submission.city) },
      { id: 'route-shape', label: submission.kind === 'route' ? 'Route has start and end' : 'Recommendation shape selected', ready: submission.kind !== 'route' || Boolean(submission.routeStart && submission.routeEnd) },
      { id: 'provider', label: 'Local map identity supplied', ready: Boolean(submission.localMapUrl) },
      { id: 'rights', label: 'Sharing consent confirmed', ready: submission.rightsConsent === true },
    ],
  };
}
