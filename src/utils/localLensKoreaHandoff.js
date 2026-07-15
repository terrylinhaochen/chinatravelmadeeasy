const PROVIDER_MATCH_STATES = ['resolved', 'probable', 'unresolved'];
const HANDOFF_KINDS = ['place', 'route', 'street'];

export function naverMapSearchUrl(query) {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}
export function kakaoMapSearchUrl(query) {
  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}

export function appleMapSearchUrl(query) {
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
}

export function appleWalkingRouteUrl(startQuery, endQuery) {
  return `https://maps.apple.com/?saddr=${encodeURIComponent(startQuery)}&daddr=${encodeURIComponent(endQuery)}&dirflg=w`;
}

export function buildKoreaLocalLensHandoff(candidate) {
  const match = candidate.providerMatch || {};
  const canAutoSave = match.state === 'resolved'
    && match.kind === 'place'
    && Boolean(match.naverPlaceId)
    && Boolean(match.kakaoPlaceId)
    && Boolean(match.reviewedCoordinates);

  if (match.kind === 'route') {
    return {
      canAutoSave: false,
      statusLabel: 'Bounded route · local-provider endpoints need review',
      statusTone: match.state || 'probable',
      note: match.note,
      links: [
        { label: 'Start in Naver Map ↗', url: naverMapSearchUrl(match.startQuery) },
        { label: 'End in Naver Map ↗', url: naverMapSearchUrl(match.endQuery) },
        { label: 'Start in KakaoMap ↗', url: kakaoMapSearchUrl(match.startQuery) },
        { label: 'End in KakaoMap ↗', url: kakaoMapSearchUrl(match.endQuery) },
        { label: 'Preview walk in Apple Maps ↗', url: appleWalkingRouteUrl(match.startQuery, match.endQuery) },
      ],
    };
  }

  const links = [
    {
      label: match.naverPlaceId ? 'Open verified Naver place ↗' : 'Search Naver Map ↗',
      url: match.naverUrl || naverMapSearchUrl(candidate.mapQuery),
    },
    {
      label: match.kakaoPlaceId ? 'Open verified Kakao place ↗' : 'Search KakaoMap ↗',
      url: match.kakaoUrl || kakaoMapSearchUrl(candidate.mapQuery),
    },
    { label: 'Search Apple Maps ↗', url: appleMapSearchUrl(candidate.mapQuery) },
  ];

  return {
    canAutoSave,
    statusLabel: canAutoSave
      ? 'Resolved place · safe to save'
      : match.state === 'unresolved'
        ? 'Not map-ready · exact start or place still missing'
        : 'Probable place · review before saving',
    statusTone: match.state || 'unresolved',
    note: match.note,
    links,
  };
}

export function validateKoreaLocalLensProviderMatch(candidate) {
  const errors = [];
  const match = candidate?.providerMatch;
  if (!match || typeof match !== 'object') return { valid: false, errors: ['providerMatch is required'] };
  if (!HANDOFF_KINDS.includes(match.kind)) errors.push(`invalid handoff kind: ${match.kind || 'missing'}`);
  if (!PROVIDER_MATCH_STATES.includes(match.state)) errors.push(`invalid provider state: ${match.state || 'missing'}`);
  if (!match.checkedAt || Number.isNaN(Date.parse(match.checkedAt))) errors.push('checkedAt must be a valid date');
  if (!String(match.note || '').trim()) errors.push('provider review note is required');

  if (match.kind === 'route') {
    if (!String(match.startQuery || '').trim()) errors.push('route startQuery is required');
    if (!String(match.endQuery || '').trim()) errors.push('route endQuery is required');
  }

  if (match.state === 'resolved') {
    if (match.kind !== 'place') errors.push('only a place can use the resolved state');
    if (!match.naverPlaceId || !match.naverUrl) errors.push('resolved place requires a Naver identity');
    if (!match.kakaoPlaceId || !match.kakaoUrl) errors.push('resolved place requires a Kakao identity');
    if (!match.reviewedCoordinates) errors.push('resolved place requires reviewed coordinates');
    if (!String(match.address || '').trim()) errors.push('resolved place requires a reviewed address');
  }

  return { valid: errors.length === 0, errors };
}
