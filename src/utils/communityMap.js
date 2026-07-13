export const CTME_STAGED_PLACES_KEY = 'ctme-video-map-staged-places';
export const CTME_EXPERIENCES_KEY = 'ctme-place-experiences';
export const CTME_CORRECTIONS_KEY = 'ctme-place-corrections';

export function amapLink(place) {
  const name = `${place.localName || place.name} ${place.city || ''}`.trim();
  return `https://uri.amap.com/marker?position=${place.longitude},${place.latitude}&name=${encodeURIComponent(name)}&src=chinatravelmadeeasy&coordinate=wgs84&callnative=1`;
}
export function appleMapsLink(place) {
  const query = `${place.localName || place.name}, ${place.city || ''}`.trim();
  return `https://maps.apple.com/?q=${encodeURIComponent(query)}&ll=${place.latitude},${place.longitude}`;
}
export function videoMapImportHref(video) {
  const places = (video?.places || []).filter((item) => item.resolution === 'resolved');
  if (!places.length) return null;
  const text = places
    .map((place, index) => `${index + 1}. ${place.name} / ${place.localName} — ${place.city || video.city} — ${place.address}. ${place.evidence}`)
    .join('\n\n');
  const params = new URLSearchParams({
    title: `${video.city} field note by ${video.creator}`,
    text,
    url: video.sourceUrl,
  });
  return `/map-import/?${params.toString()}`;
}
export function getStagedPlaces() { return read(CTME_STAGED_PLACES_KEY, []); }
export function stagePlaces(places) {
  const merged = new Map(getStagedPlaces().map((item) => [item.id, item]));
  places.filter((item) => item.resolution === 'resolved').forEach((item) => merged.set(item.id, item));
  const value = Array.from(merged.values());
  localStorage.setItem(CTME_STAGED_PLACES_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('ctme-video-map-updated'));
  return value;
}
export function removeStagedPlace(id) {
  const value = getStagedPlaces().filter((item) => item.id !== id);
  localStorage.setItem(CTME_STAGED_PLACES_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('ctme-video-map-updated'));
  return value;
}
export function savePlaceExperience(experience) {
  const current = read(CTME_EXPERIENCES_KEY, []);
  const clientRequestId = experience.clientRequestId || crypto.randomUUID();
  const previous = current.find((item) => item.clientRequestId === clientRequestId);
  const saved = { ...previous, ...experience, clientRequestId, id: previous?.id || crypto.randomUUID(), createdAt: previous?.createdAt || new Date().toISOString() };
  localStorage.setItem(CTME_EXPERIENCES_KEY, JSON.stringify([saved, ...current.filter((item) => item.clientRequestId !== clientRequestId)].slice(0, 100)));
  return saved;
}
export function getPlaceExperiences(placeId) {
  return read(CTME_EXPERIENCES_KEY, []).filter((item) => item.placeId === placeId);
}
export function savePlaceCorrection(correction) {
  const current = read(CTME_CORRECTIONS_KEY, []);
  const clientRequestId = correction.clientRequestId || crypto.randomUUID();
  const previous = current.find((item) => item.clientRequestId === clientRequestId);
  const saved = { ...previous, ...correction, clientRequestId, id: previous?.id || crypto.randomUUID(), status: previous?.status || 'submitted', createdAt: previous?.createdAt || new Date().toISOString() };
  localStorage.setItem(CTME_CORRECTIONS_KEY, JSON.stringify([saved, ...current.filter((item) => item.clientRequestId !== clientRequestId)].slice(0, 100)));
  return saved;
}
export function getPlaceCorrections(placeId) {
  return read(CTME_CORRECTIONS_KEY, []).filter((item) => item.placeId === placeId);
}
export function exportPlaces(places, format = 'csv') {
  const filename = `china-travel-map-${new Date().toISOString().slice(0, 10)}`;
  if (format === 'geojson') {
    const geojson = { type: 'FeatureCollection', features: places.map((item) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [item.longitude, item.latitude] }, properties: { name: item.name, localName: item.localName, city: item.city, category: item.category, amap: amapLink(item), appleMaps: appleMapsLink(item) } })) };
    download(`${filename}.geojson`, JSON.stringify(geojson, null, 2), 'application/geo+json');
    return;
  }
  const fields = ['name', 'localName', 'city', 'category', 'address', 'latitude', 'longitude'];
  const csv = [fields.join(','), ...places.map((item) => fields.map((field) => csvCell(item[field])).join(','))].join('\n');
  download(`${filename}.csv`, csv, 'text/csv');
}
function csvCell(value) { return `"${String(value ?? '').replaceAll('"', '""')}"`; }
function download(filename, value, type) {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
}
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } }
