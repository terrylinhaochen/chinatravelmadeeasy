# Local-knowledge contribution runbook

## Purpose

The short-term supply loop is available at `/map-import/#contribute` inside the existing Add Places workflow.

It collects evidence for review, not generic recommendations and not publish-ready pins. A contribution must preserve enough of the source ecosystem for a reviewer to answer:

1. What did the original source actually claim?
2. Is this one place, a bounded route, or still spatially unclear?
3. Why might it change a travel decision?
4. Is a local map identity already available?
5. What translation and provider work remains before publication?

## Accepted evidence

- a public Xiaohongshu, Dianping, Instagram, or TikTok link;
- a local-language publication or guide;
- a local map share link;
- pasted caption or screenshot OCR text;
- first-person local knowledge with the original place or route name.

The contributor chooses `place`, `route`, or `unclear`. Routes require a named start and end. An unbounded street should remain unclear until a usable segment is supplied.

The form does not ask for a contributor name or email. It saves the prepared record on the current device and lets the person download JSON or deliberately open an email draft. Nothing is transmitted automatically.

## Submission contract

Each `ctme-local-knowledge-v1` record contains:

- stable evidence-and-entity fingerprint;
- creation time;
- city and source language;
- source ecosystem and canonical public URL;
- original place or route name;
- original evidence excerpt;
- concrete reason it might change a trip;
- contributor context: source found, planning, visited, or local knowledge;
- optional local map share link;
- route start and end when applicable;
- explicit sharing consent;
- pending review states for language detection, translation, provider resolution, and publication.

The URL validator accepts public HTTPS links only, rejects credentials and local/private-network hosts, checks social-platform host alignment, and restricts map links to supported providers.

## Review downloaded records

Keep downloaded records in a private research folder outside the public repository. Then run:

```sh
npm run review:local-knowledge -- /private/path/to/submissions/*.json
```

For a full machine-readable queue:

```sh
npm run review:local-knowledge -- --json /private/path/to/submissions/*.json
```

The reviewer groups duplicate evidence for the same source, city, original identity, and recommendation shape while preserving separate places mentioned in one post. It reports:

- accepted and rejected records;
- duplicates merged;
- language, ecosystem, and place-versus-route coverage;
- local-map-link coverage;
- a queue ordered by newest evidence.

## Human review order

1. Open the original source or inspect the pasted excerpt.
2. Confirm the language, city, and whether the evidence is first-person, promotional, official, or copied.
3. Translate the exact claim while preserving the original wording, name, qualifiers, and warnings.
4. Split multi-place sources into separate candidate entities without losing shared provenance.
5. Confirm `place`, `route`, or `unclear`; require endpoints for routes.
6. Search the local provider using the original name and city.
7. Compare aliases, address, category, branch, entrance, and provider-specific identity.
8. Merge duplicate evidence into an existing candidate rather than creating duplicate cards.
9. Mark resolved, probable, or unresolved using the same provider rubric.
10. Publish only actionable, non-spam evidence with a correction and takedown path.

## Initial supply gate

Collect 20 recent Shanghai submissions before judging the pipeline. The first readout should report:

- share from Xiaohongshu and Dianping versus bridging sources;
- language and category coverage;
- place-versus-route distribution;
- duplicates per unique entity;
- share carrying a local map link;
- share reaching a resolved provider identity;
- corrections required per 100 candidate identities;
- review time and reasons for rejection.

This measures whether community evidence can become usable supply. It does not yet measure whether travelers choose, save, reopen, or visit the resulting recommendations; the Local Lens pilot measures the next step.
