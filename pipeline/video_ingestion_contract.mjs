const hosts = new Map([
  ['tiktok.com', 'tiktok'], ['www.tiktok.com', 'tiktok'],
  ['instagram.com', 'instagram'], ['www.instagram.com', 'instagram'],
]);

export const EVIDENCE_PRIORITY = Object.freeze({
  address: 7, location_tag: 7, caption: 6, description: 6, transcript: 5, ocr: 4, visual: 3, editorial: 2,
});

export function normalizeVideoUrl(input) {
  const url = new URL(input); const platform = hosts.get(url.hostname.toLowerCase());
  if (!platform) throw new Error('unsupported_host');
  let externalId = '';
  if (platform === 'tiktok') externalId = url.pathname.match(/^\/@[A-Za-z0-9._]{1,64}\/video\/(\d+)\/?$/)?.[1];
  if (platform === 'instagram') externalId = url.pathname.match(/^\/(?:reel|p)\/([A-Za-z0-9_-]+)\/?$/)?.[1];
  if (!externalId) throw new Error('unsupported_url');
  const canonicalUrl = platform === 'instagram'
    ? `https://www.instagram.com/reel/${externalId}/`
    : `https://www.tiktok.com${url.pathname.replace(/\/$/, '')}`;
  return { platform, externalId, cacheKey: `${platform}:${externalId}`, canonicalUrl };
}

export function pickBindingEvidence(candidates) {
  return [...candidates].sort((a, b) => EVIDENCE_PRIORITY[b.type] - EVIDENCE_PRIORITY[a.type] || b.confidence - a.confidence)[0] || null;
}

export function resolutionState(score, { cityAgreement, providerIdentityAgreement }) {
  if (score >= 0.9 && cityAgreement && providerIdentityAgreement) return 'resolved';
  if (score >= 0.75) return 'probable';
  return 'unresolved';
}

export function mayAutoPublish({ embeddable, chinaRelevant, duplicate, safe, spam, actionable, mentions }) {
  return Boolean(embeddable && chinaRelevant && !duplicate && safe && !spam && actionable && mentions.some((mention) => mention.resolution === 'resolved'));
}
