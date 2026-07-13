const MAX_PLACES = 12;
const MAX_TEXT = 280;
const DECISIONS = new Set(['keep', 'maybe', 'drop']);

export function createSharedWorkspace({ title, source, places, constraints } = {}) {
  return {
    version: 1,
    title: cleanText(title || 'Shared China places', 96),
    source: cleanSource(source),
    constraints: cleanConstraints(constraints),
    places: (Array.isArray(places) ? places : []).slice(0, MAX_PLACES).map((place) => ({
      name: cleanText(place?.name, 80),
      localName: cleanText(place?.localName, 80),
      city: cleanText(place?.city, 60),
      category: cleanText(place?.category || 'Place', 40),
      confidence: cleanText(place?.confidence || 'text match', 40),
      note: cleanText(place?.note, 180),
      sourceUrl: cleanUrl(place?.sourceUrl),
      sourcePlatform: cleanText(place?.sourcePlatform, 40),
      decision: DECISIONS.has(place?.decision) ? place.decision : 'maybe',
      decisionReason: cleanText(place?.decisionReason, MAX_TEXT),
    })).filter((place) => place.name),
  };
}

export function encodeSharedWorkspace(workspace) {
  const json = JSON.stringify(createSharedWorkspace(workspace));
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeSharedWorkspace(value) {
  if (!value || typeof value !== 'string' || value.length > 16000) return null;
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (parsed?.version !== 1 || !Array.isArray(parsed.places)) return null;
    const workspace = createSharedWorkspace(parsed);
    return workspace.places.length ? workspace : null;
  } catch {
    return null;
  }
}

export function findWorkspaceConflicts(workspace) {
  const clean = createSharedWorkspace(workspace);
  const conflicts = [];
  const cities = Array.from(new Set(clean.places.map((place) => place.city).filter(Boolean)));
  const seen = new Map();

  clean.places.forEach((place, index) => {
    if (place.decision === 'drop') return;
    if (!place.city) conflicts.push({ placeIndex: index, kind: 'identity', message: 'City is missing, so the map query may select the wrong place.' });
    if (!place.localName) conflicts.push({ placeIndex: index, kind: 'identity', message: 'Chinese name is missing; verify it before the mainland map handoff.' });
    if (!['known place', 'structured list', 'resolved'].includes(place.confidence)) {
      conflicts.push({ placeIndex: index, kind: 'confidence', message: 'This is a heuristic text match and still needs a provider check.' });
    }
    const key = `${place.name.toLowerCase()}|${place.city.toLowerCase()}`;
    if (seen.has(key)) {
      conflicts.push({ placeIndex: index, kind: 'duplicate', message: `Possible duplicate of place ${seen.get(key) + 1}.` });
    } else {
      seen.set(key, index);
    }
  });

  if (cities.length > 1) {
    conflicts.unshift({
      placeIndex: null,
      kind: 'distance',
      message: `This task spans ${cities.length} cities (${cities.join(', ')}). Split it before proposing one day route.`,
    });
  }
  if (!clean.places.some((place) => place.decision === 'keep')) {
    conflicts.unshift({ placeIndex: null, kind: 'decision', message: 'Nothing is marked Keep yet, so there is no route to hand off.' });
  }
  return conflicts;
}

export function sequenceKeptPlaces(workspace) {
  const clean = createSharedWorkspace(workspace);
  const groups = new Map();
  clean.places.forEach((place, sourceIndex) => {
    if (place.decision !== 'keep') return;
    const city = place.city || 'City not set';
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city).push({ ...place, sourceIndex });
  });
  return Array.from(groups, ([city, places]) => ({ city, places }));
}

export function decisionCounts(workspace) {
  const counts = { keep: 0, maybe: 0, drop: 0 };
  createSharedWorkspace(workspace).places.forEach((place) => { counts[place.decision] += 1; });
  return counts;
}

function cleanSource(source) {
  return {
    url: cleanUrl(source?.url),
    platform: cleanText(source?.platform || 'Pasted text', 40),
    text: cleanText(source?.text, 1200),
  };
}

function cleanConstraints(constraints = {}) {
  return {
    base: cleanText(constraints.base, 96),
    time: cleanText(constraints.time, 96),
    pace: ['relaxed', 'balanced', 'full'].includes(constraints.pace) ? constraints.pace : 'balanced',
    mustDo: cleanText(constraints.mustDo, MAX_TEXT),
    needs: cleanText(constraints.needs, MAX_TEXT),
  };
}

function cleanUrl(value) {
  const text = cleanText(value, 600);
  if (!text) return '';
  try {
    const url = new URL(text);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function cleanText(value, maxLength) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}
