#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const inputUrl = process.argv[2];
const outArg = process.argv[3];

if (!inputUrl) {
  console.error('Usage: node pipeline/ingest_google_maps_list.mjs <google-maps-list-url> [out.json]');
  process.exit(1);
}

const userAgent = 'agent-reach/1.0';

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      ...headers,
    },
  });
  if (!response.ok) throw new Error(`Fetch failed ${response.status}: ${url}`);
  return response.text();
}

async function resolveGoogleMapsUrl(url) {
  const response = await fetch(url, {
    redirect: 'manual',
    headers: {
      'User-Agent': userAgent,
    },
  });
  const location = response.headers.get('location');
  if (location) return new URL(location, url).toString();
  return response.url || url;
}

function extractListId(value) {
  const decoded = decodeURIComponent(String(value || ''));
  const patterns = [
    /\/placelists\/list\/([A-Za-z0-9_-]+)/,
    /[!?&]list=([A-Za-z0-9_-]+)/,
    /!2s([A-Za-z0-9_-]+)/,
    /\/data=.*?2s([A-Za-z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function getListUrlForId(listId) {
  const pb = `!1m1!1s${listId}!2e2!3e2!4i500`;
  return `https://www.google.com/maps/preview/entitylist/getlist?authuser=0&hl=en&gl=us&pb=${encodeURIComponent(pb)}`;
}

function cleanGoogleJson(text) {
  return text.replace(/^\)\]\}'\n?/, '');
}

function parseListPayload(text, sourceUrl) {
  const root = JSON.parse(cleanGoogleJson(text));
  const list = root?.[0];
  if (!Array.isArray(list)) throw new Error('Unexpected Google Maps list payload shape.');
  const id = list?.[0]?.[0] || '';
  const canonicalUrl = list?.[2]?.[2] || '';
  const owner = list?.[3] || [];
  const places = (list?.[8] || []).map((item, index) => {
    const place = item?.[1] || [];
    const coordinates = place?.[5] || [];
    return {
      id: `${id}:${index + 1}`,
      name: item?.[2] || place?.[2] || '',
      note: item?.[3] || '',
      address: place?.[4] || '',
      searchText: place?.[2] || '',
      latitude: coordinates?.[2] ?? null,
      longitude: coordinates?.[3] ?? null,
      googleFeatureId: place?.[8] || '',
      sourceProvider: 'Google Maps',
    };
  }).filter((place) => place.name);

  return {
    provider: 'Google Maps',
    sourceUrl,
    canonicalUrl,
    listId: id,
    title: list?.[4] || 'Google Maps list',
    description: list?.[5] || '',
    emoji: list?.[17] || '',
    owner: {
      name: owner?.[0] || '',
      avatarUrl: owner?.[1] || '',
      id: owner?.[2] || '',
    },
    placeCount: list?.[12] || places.length,
    importedAt: new Date().toISOString(),
    places,
  };
}

async function ingest(url) {
  const resolvedUrl = await resolveGoogleMapsUrl(url);
  const listId = extractListId(resolvedUrl) || extractListId(url);
  if (!listId) throw new Error('Could not find a Google Maps list id. The list may be private or Google changed the link shape.');
  const getListUrl = getListUrlForId(listId);
  const payload = await fetchText(getListUrl, {
    Referer: resolvedUrl,
  });
  return parseListPayload(payload, url);
}

const result = await ingest(inputUrl);
const json = `${JSON.stringify(result, null, 2)}\n`;

if (outArg) {
  const outPath = path.resolve(process.cwd(), outArg);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, json);
  console.log(`Imported ${result.places.length} places from "${result.title}" to ${path.relative(process.cwd(), outPath)}.`);
} else {
  process.stdout.write(json);
}
