export const CTME_USER_KEY = 'ctme-map-user';
export const CTME_SAVED_PIN_LISTS_KEY = 'ctme-map-saved-places';
export const CTME_COLLECTED_COLLECTIONS_KEY = 'ctme-collected-curated';
export const CTME_STATE_EVENT = 'ctme-state-updated';

export function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(String(email || '').trim());
}

export function getUser() {
  return readJson(CTME_USER_KEY, null);
}

export function setUser(email, attributes = {}) {
  const cleanEmail = String(email || '').trim();
  if (!isValidEmail(cleanEmail)) return null;
  const existing = getUser();
  const user = {
    email: cleanEmail,
    ...attributes,
    createdAt: existing?.createdAt || new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
  };
  writeJson(CTME_USER_KEY, user);
  emitStateUpdate();
  return user;
}

export function getSavedPinLists() {
  return readJson(CTME_SAVED_PIN_LISTS_KEY, []);
}

export function savePinList(collection) {
  const current = getSavedPinLists();
  const cleanCollections = splitPinListByCity(collection);
  writeJson(CTME_SAVED_PIN_LISTS_KEY, mergeSavedPinLists(current, cleanCollections));
  emitStateUpdate();
  return cleanCollections.length === 1 ? cleanCollections[0] : cleanCollections;
}

export function mergeSavedPinLists(current, cleanCollections, limit = 32) {
  const incomingIds = new Set(cleanCollections.map((item) => item.id));
  const sourceIds = new Set(cleanCollections.map((item) => item.sourceCollectionId).filter(Boolean));
  return [
    ...cleanCollections,
    ...current.filter((item) => !incomingIds.has(item.id) && !sourceIds.has(item.sourceCollectionId || item.id)),
  ].slice(0, limit);
}

export function splitPinListByCity(collection) {
  const places = Array.isArray(collection?.places) ? collection.places.filter(Boolean) : [];
  const baseId = collection.id || `uploaded:${Date.now()}`;
  const savedAt = collection.savedAt || new Date().toISOString();
  const groups = new Map();
  places.forEach((place) => {
    const city = String(place.city || '').trim() || 'Needs city review';
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city).push(place);
  });
  if (!groups.size) groups.set('Needs city review', []);
  const split = groups.size > 1;
  return Array.from(groups.entries()).map(([city, cityPlaces]) => ({
    ...collection,
    id: split ? `${baseId}:${slugStateValue(city)}` : baseId,
    sourceCollectionId: baseId,
    name: split ? `${collection.name || 'Saved places'} · ${city}` : (collection.name || 'Saved places'),
    city,
    places: cityPlaces,
    type: 'uploaded',
    savedAt,
  }));
}

export function getCollectedCollections() {
  return readJson(CTME_COLLECTED_COLLECTIONS_KEY, []);
}

export function collectCuratedCollection(collection) {
  const current = getCollectedCollections();
  const cleanCollection = {
    ...collection,
    type: collection.type || 'curated',
    savedAt: collection.savedAt || new Date().toISOString(),
  };
  writeJson(
    CTME_COLLECTED_COLLECTIONS_KEY,
    [cleanCollection, ...current.filter((item) => item.id !== cleanCollection.id)].slice(0, 32)
  );
  emitStateUpdate();
  return cleanCollection;
}

export function getProfileSummary() {
  const uploadedLists = getSavedPinLists();
  const collectedCollections = getCollectedCollections();
  const uploadedPins = uploadedLists.reduce((total, list) => {
    const places = Array.isArray(list.places) ? list.places : [];
    return total + places.length;
  }, 0);
  const collectedPins = collectedCollections.reduce((total, list) => total + Number(list.placeCount || 0), 0);
  return {
    uploadedLists,
    collectedCollections,
    uploadedPins,
    collectedPins,
    totalPins: uploadedPins + collectedPins,
  };
}

export function emitStateUpdate() {
  window.dispatchEvent(new CustomEvent(CTME_STATE_EVENT));
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function slugStateValue(value) {
  return String(value || 'city')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'city';
}
