# CrowdListen to Codex Content Loop

This site should use CrowdListen as the evidence engine and Codex as the editorial engine.
The goal is to produce high-quality China travel guides that answer real traveler questions
and can be retrieved by search engines, answer engines, and map-planning workflows.

## Layering

1. **Evidence layer**
   - CrowdListen collects traveler reviews, forum threads, local social posts, review-site signals, and long-form trip reports.
   - It clusters repeated questions, concerns, recommendations, and failure modes.
   - Direct quotes stay attached to public source URLs and should not be republished without attribution.

2. **Seed layer**
   - `pipeline/content_seeds_from_crowdlisten.py` reads CrowdListen `entity_insights` and `insight_evidence`.
   - It writes `src/data/contentSeeds.json` for the Astro page and `public/content-seeds.json` for crawlers/tools.
   - It also writes `content-seed-queue.md`, which is the Codex editorial queue.

3. **Guide layer**
   - Codex uses each seed to draft or update guide pages in `src/content/guides/`.
   - Every published guide should answer the question directly, expose practical decisions, link related guides, and keep time-sensitive claims dated.
   - FAQs in guide frontmatter become FAQPage JSON-LD automatically.

4. **Indexing layer**
   - `/answers/` is the stable traveler-facing QA page.
   - `/content-seeds/` is the public seed surface for emerging guide coverage and AI-search retrieval.
   - `/content-seeds.json` is the machine-readable version.
   - `/llms.txt` points answer engines to the canonical guide set and seed surface.

## Agent loop

Run this when the CrowdListen China travel entity has new data:

```sh
CONTENT_SEEDS_ENTITY_ID=<crowdlisten-entity-id> npm run seed:content
npm run build
```

Without an entity ID, the same command refreshes the public JSON and editorial
queue from the starter corpus in `src/data/contentSeeds.json`.

Then ask Codex to process `content-seed-queue.md`:

1. Pick the highest-priority seed with enough evidence.
2. Decide whether it updates an existing guide or needs a new guide.
3. Draft the answer in QA-first form.
4. Add or update guide frontmatter FAQs.
5. Add map-save candidates when the seed includes places.
6. Update `/answers/` only when the question is stable enough to become canonical.
7. Run `npm run build` and visually verify the changed pages.

## Quality rules

- Do not publish raw social feeds.
- Do not publish direct quotes without source links.
- Treat CrowdListen seeds as prompts for editorial review, not facts by themselves.
- Require multiple sources before creating a new canonical guide.
- Mark fast-changing claims with dates and official-source caveats.
- Prefer simple answer pages over dashboards.
