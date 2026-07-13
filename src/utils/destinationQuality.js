const includesAny = (value, terms) => terms.some((term) => value.includes(term));

export const PUBLISHED_DESTINATION_SLUGS = ['hong-kong', 'shanghai', 'beijing', 'chongqing', 'chengdu', 'xian', 'guangzhou', 'shenzhen', 'hangzhou', 'kunming', 'dali', 'lijiang'];

export const DESTINATION_RUBRIC = [
  { id: 'point_of_view', label: 'Editorial point of view' },
  { id: 'trip_structure', label: 'Usable trip rhythm' },
  { id: 'execution_recovery', label: 'Execution and recovery advice' },
  { id: 'map_identity', label: 'Bilingual map-ready identities' },
  { id: 'current_sources', label: 'Dated planning sources' },
  { id: 'traveler_media', label: 'Grounded traveler media' },
];

export function auditDestination(destination, videos = []) {
  const editorial = destination.editorial;
  const sectionText = (editorial?.sections ?? [])
    .map((section) => `${section.title} ${section.body}`.toLowerCase())
    .join(' ');
  const completePlaces = (destination.places ?? []).filter((place) =>
    place.localName
    && place.mapQuery
    && place.why?.length >= 80
    && place.budgetTip?.length >= 60
    && place.confidence === 'resolved'
  );
  const groundedVideos = videos.filter((video) =>
    video.sourceUrl
    && video.checkedAt
    && video.guideBody?.length >= 120
    && (video.places.length === 0 || video.places.every((place) => place.evidence && place.confidence >= 0.75))
  );

  const results = {
    point_of_view: Boolean(editorial?.dek && editorial.dek.length >= 120 && editorial.sections.length >= 4),
    trip_structure: Boolean(editorial && includesAny(sectionText, ['day one', 'day two', 'half-day', 'route', 'walk', 'base', 'stay'])),
    execution_recovery: Boolean(editorial && includesAny(sectionText, ['fallback', 'recovery', 'closed', 'exit', 'weather', 'heat', 'passport', 'transport', 'return', 'border'])),
    map_identity: destination.places.length >= 3 && completePlaces.length === destination.places.length,
    current_sources: Boolean(editorial?.checkedAt && editorial.sources.length >= 2),
    traveler_media: groundedVideos.length > 0,
  };
  const checks = DESTINATION_RUBRIC.map((criterion) => ({ ...criterion, passed: results[criterion.id] }));
  const editorialReady = checks.slice(0, 5).every((criterion) => criterion.passed);

  return {
    tier: editorialReady ? 'full' : 'starter',
    checks,
    missing: checks.filter((criterion) => !criterion.passed).map((criterion) => criterion.label),
    groundedVideoCount: groundedVideos.length,
  };
}

export function selectHomepageVideos(videos, limit = 3) {
  const grounded = videos.filter((video) => video.places.some((place) => place.resolution === 'resolved'));
  const selected = [];
  const destinations = new Set();
  for (const video of grounded) {
    if (destinations.has(video.destinationSlug)) continue;
    selected.push(video);
    destinations.add(video.destinationSlug);
    if (selected.length === limit) return selected;
  }
  for (const video of grounded) {
    if (selected.includes(video)) continue;
    selected.push(video);
    if (selected.length === limit) break;
  }
  return selected;
}
