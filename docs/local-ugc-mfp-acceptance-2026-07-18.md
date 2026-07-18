# Chinese local-source to map MFP acceptance

Date: 2026-07-18

## Product claim under test

The minimum functioning product should let an English-speaking traveler start from locally surfaced China evidence, understand why the place matters locally, distinguish useful leads from provider-resolved pins, save only the safe pin, and keep unresolved local leads attached to the evidence trail.

This record covers the current static/manual Chinese slice. It does not certify live Xiaohongshu, Dianping, Douyin, AMap, Apple Maps Server, or Supabase worker operation.

## Current accepted MFP path

1. Open `/discover/`.
2. Find the Shanghai local-source guide card.
3. Use `Open evidence ledger` to reach `/curated/ctme-local-lens/what-yangpu-residents-use-on-a-slow-day/shanghai/#source-notes-heading`.
4. Read the source notes, original Chinese cues, evidence grades, and map-resolution states.
5. For each reviewed candidate, read the explicit trip role and next action so research becomes a travel decision rather than a generic recommendation.
6. Save `1 map-ready pin` from the city guide.
7. Open `/profile/`.
8. Confirm Profile shows:
   - the saved provider-resolved pin;
   - AMap and Apple handoff links;
   - why the pin survived review;
   - the trip role and next action;
   - the original Chinese cue;
   - `Review 3 unresolved local leads`, linking back to the guide evidence ledger.
9. Use `/map-import/?contributionCity=Shanghai&contributionLanguage=Chinese&contributionPlatform=xiaohongshu&contributionKind=place#contribute` to prepare a UGC review packet from a Xiaohongshu, Dianping, short-video, local-map, caption, OCR, or personal-knowledge source.
10. Classify the local-use signal as direct local first-person use, local creator or resident UGC, corroborated local-use, local-use proxy, traveler-only evidence, or unknown.
11. Confirm the prepared packet shows a local-grid review summary separating source evidence, local-use fit, provider identity, and traveler decision gates.
12. Open `/profile/` and confirm the UGC review packet remains visible with provider resolution pending, local-use signal, local-grid review state, review stages, original-source access, and a link back to the reviewed Shanghai local grid.

## Acceptance criteria

| Requirement | Current evidence |
| --- | --- |
| Traveler can discover the local-source slice from Discover | `/discover/` contains `Try the local-to-map loop`, `Open evidence ledger`, and `Save reviewed pin`. |
| Source evidence preserves original Chinese context | The Shanghai guide shows source notes with `originalCue`, `cueMeaning`, platform, retrieval date, and linked candidates. |
| Local use is graded rather than treated as a badge | The guide labels direct resident testimony, corroborated local-use signals, and local-use proxies separately. |
| Local evidence becomes a traveler decision | Every reviewed candidate exposes a `Trip role` and `Next action`, and the saved profile card preserves those fields for the map-ready pin. |
| Provider resolution is separate from local evidence strength | The guide and tests keep only `resolutionState === "resolved"` candidates eligible for automatic save. |
| Map save does not overclaim unresolved leads | The city save payload includes only provider-resolved places; Profile links unresolved leads back to the evidence ledger. |
| UGC is supported honestly in the current slice | UGC enters as a review packet only. Xiaohongshu and Dianping are explicitly labeled not connected. |
| UGC intake grades localness explicitly | The contribution form requires a local-use signal before the packet can be prepared; unknown is allowed but remains not ready as guide supply until review. |
| UGC packets enter the same local-grid rubric | Prepared packets expose source evidence, local-use fit, provider identity, and traveler-decision gates before they can become public guide candidates. |
| UGC intake persists into the traveler workspace | A clean rendered browser can prepare a Xiaohongshu-style packet, open Profile, and see `Provider match pending`, `Local-use signal`, `UGC evidence packet`, `Map-ready pin`, `Open original source`, and `Compare with reviewed local grid`. |
| Local dogfooding can complete without production email | Localhost sign-in stores `authProvider: "localhost-preview"` and does not send a Supabase magic link. |

## Commands that should pass

```sh
/Users/terry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/localUseCuration.test.mjs
/Users/terry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/placeExtraction.test.mjs tests/localPrototypeState.test.mjs tests/communityMapState.test.mjs tests/sharedLocationTask.test.mjs tests/videoIngestion.test.mjs tests/librarySearch.test.mjs tests/destinationQuality.test.mjs tests/localLensStudy.test.mjs tests/localLanguageResearch.test.mjs tests/localUseCuration.test.mjs tests/localKnowledgeSubmission.test.mjs tests/supabaseBackendContract.test.mjs
/Users/terry/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ./node_modules/.bin/astro build
```

## Rendered checks used for acceptance

Serve `dist/` locally after build:

```sh
python3 -m http.server 4331 --directory dist
```

Then verify:

- `/discover/` renders the local-to-map loop and UGC review-packet boundary.
- `Open evidence ledger` routes to the Shanghai guide source-notes anchor.
- The Shanghai guide renders `Xiaohongshu — Not connected`, `Dianping — Not connected`, and `UGC intake — Review packet only`.
- A clean browser can save the one map-ready pin and reopen it from Profile with AMap/Apple links, trip role, next action, and unresolved-lead recovery.
- A clean browser can open `Add Chinese source`, fill the pre-scoped contribution form including the local-use signal, prepare a review packet, and see source evidence, local-use fit, provider identity, and traveler-decision gates in both the packet result and Profile with a reviewed-grid recovery link.

## Not accepted yet

- Live Xiaohongshu, Dianping, or Douyin retrieval.
- Automatic local-platform ranking or engagement ingestion.
- Automatic extraction from arbitrary unseen social URLs.
- Production AMap POI API and Apple Maps Server resolution.
- Cross-device saved maps and group collaboration.
- A deployed Supabase worker proving the queue, RLS, provider payload storage, and edge functions together.

The current MFP is therefore: **static/manual local Chinese evidence → evidence-graded guide candidates → one provider-resolved saved pin → retained unresolved leads → UGC review intake**.
