export const reviewedLocalUgcPackets = [
  {
    id: 'yangpu-waterfront-xhs-seeded-packet',
    platform: 'Xiaohongshu-style UGC packet',
    sourceAccess: 'operator-reviewed seed',
    livePlatformRetrieval: false,
    reviewedAt: '2026-07-18',
    sourceBoundary: 'Seeded from an operator-reviewed Chinese UGC-style caption. No live Xiaohongshu retrieval or platform ranking is claimed.',
    providerCheckedAt: '2026-07-18',
    city: 'Shanghai',
    language: 'Chinese',
    title: 'A slow Yangpu riverfront day instead of a skyline checklist',
    hook: 'Use the post to shape the day, then save only the place whose provider identity survives review.',
    originalCue: '不赶景点的一天',
    cueMeaning: 'The value is a slower local waterfront rhythm, not another landmark list.',
    localUseSignal: 'local-creator-ugc',
    localUseLabel: 'Local creator or resident UGC',
    evidenceText: '周末沿着杨浦滨江慢走，从绿之丘看江景，再去复兴岛公园散步，适合不赶景点的一天。',
    travelerRead:
      'This changes the itinerary from “see Shanghai’s skyline” to a quieter Yangpu half-day: industrial riverfront first, then a park finish if the return route is checked.',
    gridReview:
      'Original Chinese wording, local-use fit, provider identity, and traveler decision are reviewed separately before anything becomes a public guide pin.',
    guideHref: '/curated/ctme-local-lens/what-yangpu-residents-use-on-a-slow-day/shanghai/#source-notes-heading',
    contributionHref:
      '/map-import/?contributionCity=Shanghai&contributionLanguage=Chinese&contributionPlatform=xiaohongshu&contributionKind=place#contribute',
    candidates: [
      {
        id: 'xhs-green-hill-yangpu-grid-cell',
        name: 'Green Hill',
        localName: '绿之丘',
        role: 'Good candidate for the industrial-riverfront opening, but still review-before-save.',
        resolutionState: 'probable',
        gridCell: {
          sourceEvidence: 'Caption names 绿之丘 as the river-view opening of the walk.',
          localUseFit: 'Local creator route framing, but not direct resident repeat-use testimony in this packet.',
          providerIdentity: 'Probable: Chinese name and Yangpu context match the reviewed guide, but provider identity is not safe for automatic save.',
          travelerDecision: 'Keep as the opening idea; do not save until the exact provider result is checked.',
        },
      },
      {
        id: 'xhs-fuxing-island-park-grid-cell',
        name: 'Fuxing Island Park',
        localName: '复兴岛公园',
        city: 'Shanghai',
        address: '共青路386号, Yangpu, Shanghai',
        role: 'Safe slow-finish pin after AMap and Apple identity agreement.',
        resolutionState: 'resolved',
        providerLinks: {
          amap: 'https://www.amap.com/place/B00154DQQ7',
          apple: 'https://maps.apple.com/place?_provider=57879&place-id=H2710I3F80D8CC0908F',
        },
        gridCell: {
          sourceEvidence: 'Caption names 复兴岛公园 as the slow walk finish.',
          localUseFit: 'Matches the reviewed local-use cue 市民散步、观景、寻幽 from the Shanghai source ledger.',
          providerIdentity: 'Resolved: AMap and Apple identify the same park at 共青路386号.',
          travelerDecision: 'Save as the slow finish if the traveler wants neighborhood air rather than marquee sightseeing.',
        },
      },
    ],
    reviewGates: [
      { label: 'Source evidence', state: 'Original Chinese wording retained' },
      { label: 'Local-use fit', state: 'Classified as local creator or resident UGC' },
      { label: 'Provider identity', state: '1 resolved · 1 review-first' },
      { label: 'Traveler decision', state: 'Use as a slow Yangpu half-day, not a skyline checklist' },
    ],
  },
  {
    id: 'yangpu-waterfront-rain-caution-seeded-packet',
    platform: 'Chinese short-video comment packet',
    sourceAccess: 'operator-reviewed seed',
    livePlatformRetrieval: false,
    reviewedAt: '2026-07-18',
    sourceBoundary: 'Seeded from an operator-reviewed Chinese short-video-style caption and comment summary. No live Douyin retrieval, comment ranking, or platform engagement is claimed.',
    providerCheckedAt: '2026-07-18',
    city: 'Shanghai',
    language: 'Chinese',
    title: 'The riverfront walk works only if the weather and return route work',
    hook: 'Use the local warning to change timing and backup plans, not to create a false restaurant or attraction pin.',
    originalCue: '下雨天风大，回程不好打车',
    cueMeaning: 'The local value is an execution warning: exposed riverfront weather and return logistics can make the route worse.',
    localUseSignal: 'corroborated-local-use',
    localUseLabel: 'Corroborated local-use signal',
    evidenceText: '杨浦滨江下雨天风大，绿之丘附近拍照可以，但回程不好打车，最好白天走、提前看地铁或公交。',
    travelerRead:
      'This does not add a new must-see. It changes the usable version of the Yangpu plan: go earlier, keep a transit fallback, and avoid treating a rainy riverfront clip as an effortless evening route.',
    gridReview:
      'Original Chinese warning, local-use fit, provider identity, and traveler decision are reviewed separately; no candidate is saveable until a provider identity and trip role both survive review.',
    guideHref: '/curated/ctme-local-lens/what-yangpu-residents-use-on-a-slow-day/shanghai/#source-notes-heading',
    contributionHref:
      '/map-import/?contributionCity=Shanghai&contributionLanguage=Chinese&contributionPlatform=tiktok&contributionKind=route#contribute',
    candidates: [
      {
        id: 'short-video-yangpu-rain-route-grid-cell',
        name: 'Yangpu riverfront rainy-day route',
        localName: '杨浦滨江雨天路线',
        role: 'Useful as a route warning, but not a pin: timing, weather, and return transport need review.',
        resolutionState: 'unresolved',
        gridCell: {
          sourceEvidence: 'Caption/comment summary warns 下雨天风大 and 回程不好打车 along the Yangpu riverfront.',
          localUseFit: 'Corroborated local-use signal because the insight is about ordinary execution conditions, not a tourist photo claim.',
          providerIdentity: 'Unresolved and not safe for automatic save: this is a route condition across the riverfront, not a confirmed AMap or Apple POI.',
          travelerDecision: 'Do not save as a pin; use it to schedule the riverfront earlier and keep a metro or bus fallback.',
        },
      },
      {
        id: 'short-video-green-hill-rain-grid-cell',
        name: 'Green Hill',
        localName: '绿之丘',
        role: 'Known route anchor, but this packet only supports a weather/taxi caveat.',
        resolutionState: 'probable',
        gridCell: {
          sourceEvidence: 'Caption/comment summary references 绿之丘 as the photo anchor near the exposed riverfront.',
          localUseFit: 'Local-use proxy: the packet supports timing and return-route advice, not direct testimony that locals repeat this exact stop.',
          providerIdentity: 'Probable: matches the reviewed guide context, but still not safe for automatic save from this UGC packet.',
          travelerDecision: 'Keep as context only; do not save from this packet because the actionable insight is the route caveat.',
        },
      },
    ],
    reviewGates: [
      { label: 'Source evidence', state: 'Original Chinese warning retained' },
      { label: 'Local-use fit', state: 'Classified as corroborated local-use signal' },
      { label: 'Provider identity', state: '0 resolved · 2 review-first' },
      { label: 'Traveler decision', state: 'Use as timing and transport caveat, not as a map pin' },
    ],
  },
];

export function summarizeReviewedLocalUgcPackets(packets = reviewedLocalUgcPackets) {
  const candidateCount = packets.reduce((sum, packet) => sum + (packet.candidates?.length || 0), 0);
  const resolvedCandidateCount = packets.reduce(
    (sum, packet) => sum + (packet.candidates || []).filter((candidate) => candidate.resolutionState === 'resolved').length,
    0,
  );
  const gridCellCount = packets.reduce((sum, packet) => sum + (packet.candidates || []).filter((candidate) => candidate.gridCell).length, 0);
  return {
    packetCount: packets.length,
    candidateCount,
    resolvedCandidateCount,
    gridCellCount,
    livePlatformRetrievalCount: packets.filter((packet) => packet.livePlatformRetrieval).length,
  };
}

export function validateReviewedLocalUgcPacket(packet) {
  const errors = [];
  if (!packet?.id || !packet?.title || !packet?.hook) errors.push('missing-packet-identity');
  if (!packet?.platform || !packet?.sourceAccess) errors.push('missing-source-boundary');
  if (!packet?.reviewedAt || Number.isNaN(Date.parse(packet.reviewedAt))) errors.push('missing-reviewed-date');
  if (!packet?.providerCheckedAt || Number.isNaN(Date.parse(packet.providerCheckedAt))) errors.push('missing-provider-check-date');
  if (!packet?.sourceBoundary || !/No live/i.test(packet.sourceBoundary)) errors.push('missing-source-boundary-copy');
  if (packet?.livePlatformRetrieval !== false) errors.push('must-not-claim-live-platform-retrieval');
  if (!packet?.originalCue || !/[\u3400-\u9fff]/u.test(packet.originalCue)) errors.push('missing-chinese-cue');
  if (!packet?.cueMeaning || packet.cueMeaning.length < 24) errors.push('missing-cue-meaning');
  if (!packet?.evidenceText || !/[\u3400-\u9fff]/u.test(packet.evidenceText)) errors.push('missing-original-evidence');
  if (!packet?.travelerRead || packet.travelerRead.length < 60) errors.push('missing-traveler-read');
  if (!packet?.gridReview || !/provider identity/i.test(packet.gridReview)) errors.push('missing-grid-review');
  if (!Array.isArray(packet?.candidates) || packet.candidates.length < 2) errors.push('insufficient-candidates');
  if (!Array.isArray(packet?.reviewGates) || packet.reviewGates.length !== 4) errors.push('missing-review-gates');
  if ((packet?.candidates || []).some((candidate) => !['resolved', 'probable', 'unresolved'].includes(candidate.resolutionState))) {
    errors.push('invalid-candidate-resolution');
  }
  for (const candidate of packet?.candidates || []) {
    if (!candidate?.id) errors.push('missing-candidate-id');
    const gridCell = candidate?.gridCell || {};
    if (!gridCell.sourceEvidence || !gridCell.localUseFit || !gridCell.providerIdentity || !gridCell.travelerDecision) {
      errors.push(`missing-grid-cell-${candidate?.id || candidate?.name || 'unknown'}`);
    }
    if (candidate?.resolutionState === 'resolved' && !/Resolved/i.test(gridCell.providerIdentity || '')) {
      errors.push(`resolved-cell-without-provider-proof-${candidate.id}`);
    }
    if (candidate?.resolutionState !== 'resolved' && !/not safe|not save|do not save|Probable/i.test(gridCell.providerIdentity || gridCell.travelerDecision || '')) {
      errors.push(`review-cell-overclaims-save-${candidate.id}`);
    }
  }
  return { valid: errors.length === 0, errors };
}
