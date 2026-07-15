const PROVIDER_MATCH_STATES = ['resolved', 'probable', 'unresolved'];
const HANDOFF_KINDS = ['place', 'route', 'street'];

export function amapSearchUrl(query) {
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(query)}&city=310000&callnative=1`;
}

export function appleSearchUrl(query) {
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
}

export function appleWalkingRouteUrl(startQuery, endQuery) {
  return `https://maps.apple.com/?saddr=${encodeURIComponent(startQuery)}&daddr=${encodeURIComponent(endQuery)}&dirflg=w`;
}

export function buildLocalLensHandoff(candidate) {
  const match = candidate.providerMatch || {};
  const canAutoSave = match.state === 'resolved'
    && match.kind === 'place'
    && Boolean(match.amapPlaceId)
    && Boolean(match.applePlaceId);

  if (match.kind === 'route') {
    return {
      canAutoSave: false,
      statusLabel: 'Bounded route · endpoints need provider review',
      statusTone: 'probable',
      note: match.note,
      links: [
        { label: 'Start in AMap ↗', url: amapSearchUrl(match.startQuery) },
        { label: 'End in AMap ↗', url: amapSearchUrl(match.endQuery) },
        { label: 'Walking route in Apple Maps ↗', url: appleWalkingRouteUrl(match.startQuery, match.endQuery) },
      ],
    };
  }

  const links = [
    {
      label: match.amapPlaceId ? 'Open verified AMap place ↗' : 'Search AMap ↗',
      url: match.amapUrl || amapSearchUrl(candidate.mapQuery),
    },
    {
      label: match.applePlaceId ? 'Open verified Apple place ↗' : 'Search Apple Maps ↗',
      url: match.appleUrl || appleSearchUrl(candidate.mapQuery),
    },
  ];
  (match.alternateMatches || []).forEach((alternate) => {
    links.push({ label: `Check alternate: ${alternate.label} ↗`, url: alternate.url });
  });

  return {
    canAutoSave,
    statusLabel: canAutoSave
      ? 'Resolved place · safe to save'
      : match.state === 'unresolved'
        ? 'Not map-ready · choose a bounded segment first'
        : 'Probable place · review before saving',
    statusTone: match.state || 'unresolved',
    note: match.note,
    links,
  };
}

export function validateLocalLensProviderMatch(candidate) {
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
    if (!match.amapPlaceId || !match.amapUrl) errors.push('resolved place requires an AMap identity');
    if (!match.applePlaceId || !match.appleUrl) errors.push('resolved place requires an Apple identity');
    if (!String(match.address || '').trim()) errors.push('resolved place requires a reviewed address');
  }

  return { valid: errors.length === 0, errors };
}
