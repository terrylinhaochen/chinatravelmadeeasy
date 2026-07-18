export const reviewedLocalUgcPackets = [
  {
    id: 'yangpu-waterfront-xhs-seeded-packet',
    platform: 'Xiaohongshu-style UGC packet',
    sourceAccess: 'operator-reviewed seed',
    livePlatformRetrieval: false,
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
        name: 'Green Hill',
        localName: '绿之丘',
        role: 'Good candidate for the industrial-riverfront opening, but still review-before-save.',
        resolutionState: 'probable',
      },
      {
        name: 'Fuxing Island Park',
        localName: '复兴岛公园',
        role: 'Safe slow-finish pin after AMap and Apple identity agreement.',
        resolutionState: 'resolved',
      },
    ],
    reviewGates: [
      { label: 'Source evidence', state: 'Original Chinese wording retained' },
      { label: 'Local-use fit', state: 'Classified as local creator or resident UGC' },
      { label: 'Provider identity', state: '1 resolved · 1 review-first' },
      { label: 'Traveler decision', state: 'Use as a slow Yangpu half-day, not a skyline checklist' },
    ],
  },
];

export function summarizeReviewedLocalUgcPackets(packets = reviewedLocalUgcPackets) {
  const candidateCount = packets.reduce((sum, packet) => sum + (packet.candidates?.length || 0), 0);
  const resolvedCandidateCount = packets.reduce(
    (sum, packet) => sum + (packet.candidates || []).filter((candidate) => candidate.resolutionState === 'resolved').length,
    0,
  );
  return {
    packetCount: packets.length,
    candidateCount,
    resolvedCandidateCount,
    livePlatformRetrievalCount: packets.filter((packet) => packet.livePlatformRetrieval).length,
  };
}

export function validateReviewedLocalUgcPacket(packet) {
  const errors = [];
  if (!packet?.id || !packet?.title || !packet?.hook) errors.push('missing-packet-identity');
  if (!packet?.platform || !packet?.sourceAccess) errors.push('missing-source-boundary');
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
  return { valid: errors.length === 0, errors };
}
