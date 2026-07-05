# Curated Discovery and Google Maps Lists

## Finding

Public Google Maps list links can expose list data through the Maps page preload path. The shared list URL resolves to a stable placelist id, and the page preloads an `entitylist/getlist` payload containing title, owner, notes, addresses, coordinates, and Google feature ids.

This is useful for ingestion, but it is not a documented Google Maps Platform API. Treat it as an adapter around a public system-of-record URL, not as a guaranteed contract.

## Source of Record Model

Google Maps should remain the source of record for canonical place identity and routing. Our product should own the layer above it:

- imported collection metadata
- traveler notes and ranking
- edits, removals, and annotations
- remix history
- shareable collection pages
- exports back to Google Maps, Apple Maps, AMap, and static embeds

## Current Prototype

Run:

```bash
npm run lists:ingest:google -- "https://maps.app.goo.gl/6rcQCys342xzSeRx9?g_st=i" /tmp/good-restaurants-fanny-chen.json
```

This writes a normalized JSON collection:

- `provider`
- `sourceUrl`
- `canonicalUrl`
- `listId`
- `title`
- `owner`
- `placeCount`
- `places[]`

Each place carries `name`, `note`, `address`, `latitude`, `longitude`, and `googleFeatureId` when Google exposes it.

## Product Direction

The differentiator is not another generic travel guide. It is curated discovery:

1. Paste a Google Maps list, social post, screenshot, or friend note.
2. Import pins from the closest available system of record.
3. Let the user remove weak pins, add notes, group by neighborhood, and rank places.
4. Share the cleaned collection as a public page.
5. Let another traveler fork/remix it into their own map.

## Implementation Shape

Production should move Google list ingestion behind a server endpoint because browser-side fetches will run into CORS and anti-abuse behavior. The endpoint should:

- accept a public Google Maps list URL
- resolve the canonical list id
- fetch and parse the public payload
- normalize into our collection schema
- persist a snapshot, source URL, and imported timestamp
- refresh only when the owner asks, so edits remain stable

Official Google APIs still matter after ingest. Use Google Maps URLs for outbound opens and Places API details when we need current canonical data for a single place.
