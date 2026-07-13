# China Travel Made Easy

Practical travel guides for first-time foreign visitors to China who don't speak the language.
Live at [chinatravelmadeeasy.com](https://chinatravelmadeeasy.com).

## Stack

- [Astro 5](https://astro.build) — fully static output
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Markdown content collections (`src/content/guides/`)
- GitHub Pages + GitHub Actions deploy (see `.github/workflows/deploy.yml`)
- Browser-local saved-list prototype with optional Supabase email-link authentication
- Video-to-map explorer with lazy official embeds, bilingual AMap/Apple handoffs, and an isolated Supabase backend contract
- Source-dated attraction booking workflow that keeps passport identity, ticket product, entrance, and map handoff together

## Video-to-map loop

TikTok and Instagram Reel evidence now lives inside destination discovery instead of a separate video feed. Hong Kong, Shanghai, Beijing, and Chongqing are the current video-backed destination digests: expandable traveler stories distinguish resolved places from branchless food leads, historical footage, incomplete city montages, and Chongqing level or intercity-transfer ambiguity, then continue into the same bilingual place pages and Keep/Maybe/Drop review task used by other sources. Chengdu is the first full digest built without inventing video supply: its guide and six exact anchors are live, while verified short-form evidence remains an explicit coverage gap. Discover indexes story titles, creators, editorial context, evidence, and resolved places when that evidence exists. The old `/videos/` URLs remain as no-index compatibility redirects to the exact destination story. YouTube is intentionally unsupported. Resolved places can be reviewed anonymously; saving, exporting, and corrections require email-link sign-in.

Add Places also has a cache-first short-video entry. A full TikTok or Instagram URL that matches a processed record opens the existing destination story and creator-attributed Curated city collection immediately. An unseen supported link falls back to caption/OCR review and explicitly says that live ingestion is not connected; it is not presented as extracted content.

Curated now treats every sufficiently resolved short-form post as a creator-attributed city collection. China traveler stories appear first with bilingual place identities and separate AMap/Apple handoffs; the original multi-country Google Maps upload remains below as a clearly labeled imported archive, split into one city edition at a time. Collect actions persist before magic-link authentication and resume after the callback. Profile shows only the user's reviewed or collected sets rather than rendering the whole community catalog as personal state.

Place pages keep the source story, editorial context, identity confidence, map handoffs, and correction path together. A categorical visitor-verdict widget is intentionally absent: the traveler's actual take should be read from the source rather than recreated as detached “Worth it / Mixed / Skip” data. Destination digests instead include a small usefulness/correction prompt that retains a local backup and prepares an email to the editorial address.

Homepage saves use that same account boundary rather than a separate fake email state. The selected place and provider are stored before sign-in, resumed idempotently after the callback, and returned with an explicit provider link. AMap is the default for mainland-China execution; Apple Maps remains a second provider check, while Hong Kong, Macau, and Taiwan destination entry links remain Apple-first.

The isolated backend lives in `supabase/`: RLS migrations, queue-backed submission contract, public `security_invoker` views, and six Edge Function interfaces. Function entrypoints and the short-form-only production URL parser can be checked with `npm run test:supabase-functions`; static schema/function integration checks run with `npm run test:supabase-contract`; database RLS, privilege, rate-limit, deduplication, and queue behavior are specified in `supabase/tests/backend_security_test.sql` for `supabase test db`. Production ingestion additionally needs a deployed project, queue consumer, AMap, Apple Maps Server, Turnstile, and approved platform metadata credentials. The hourly Pages workflow materializes approved database records into static video/place pages when `CTME_SUPABASE_URL` and `CTME_SUPABASE_PUBLISHABLE_KEY` are configured. See `docs/video-to-map-benchmark.md` before enabling experimental media analysis; static checks are not an end-to-end backend certification.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview
```

Requires Node 22+.

## Design system

`DESIGN.md` is the active UI reference. The implemented component primitives live
in `src/styles/global.css` as `.ds-*` classes: editorial media tiles, panels,
chips, inputs, and pill buttons. Guides, Answers, and the homepage category
tiles should reuse those primitives instead of one-off card styles.

## Adding or updating a guide

1. Edit or add a markdown file in `src/content/guides/`. The filename is the URL slug.
2. Frontmatter schema (validated in `src/content.config.ts`):
   - `title`, `description`, `updated` (date), `order` (number, controls index sorting),
     `category`, `icon` (see `src/components/Icon.astro` for names), `faqs` (list of `q`/`a`).
3. FAQs in frontmatter are rendered at the bottom of the page **and** emitted as
   FAQPage JSON-LD automatically — keep them in sync by editing only the frontmatter.
4. Bump `updated` whenever facts change. The site's credibility depends on it.

## SEO/GEO features

- Per-page titles, meta descriptions, canonical URLs, OG tags
- Article + BreadcrumbList + FAQPage JSON-LD on guide pages
- `@astrojs/sitemap` (`/sitemap-index.xml`), `robots.txt`, `llms.txt`
- `/answers/`, `/content-seeds/`, and `/content-seeds.json` for QA-first AI-search retrieval
- CNAME for the custom domain lives in `public/CNAME`

## Curated imagery

The site uses authentic, source-attributed photography from `public/images/curated`.
`npm run build` verifies that every homepage, guide, and region image points at a
prepared site asset before Astro builds. The image pipeline crops, resizes, and
compresses real source photos; it does not use AI image generation or style transfer.

```sh
npm run images:verify   # checks manifest coverage, source attribution, and files
npm run images:check    # dry-runs the 60 curated photo assets
npm run images:generate # prepares optimized site crops from authentic photos
```

Image source references live in `src/data/generatedImageManifest.json` and
`src/data/regionImages.json`.

## Analytics and Search Console

Set `PUBLIC_GA_MEASUREMENT_ID` for the China Travel Made Easy GA4 stream
(`G-X2F8XWJWY6` in the Crowdlisten account). If the site needs to report to more than one GA4 property, set
`PUBLIC_GA_MEASUREMENT_IDS` to a comma-separated list. Set
`PUBLIC_GOOGLE_SITE_VERIFICATION` to the Search Console HTML tag token.
GitHub Pages deploys include the production GA4 ID and Search Console token;
`CHINATRAVELMADEEASY_GA_MEASUREMENT_IDS` can still be set as a repository
variable if the site needs to report to additional GA4 properties.

## CrowdListen content loop

CrowdListen is the evidence layer; Codex is the editorial layer. The seed loop turns
clustered traveler concerns and recommendations into guide briefs:

```sh
CONTENT_SEEDS_ENTITY_ID=<crowdlisten-entity-id> npm run seed:content
npm run build
```

The script writes `src/data/contentSeeds.json`, `public/content-seeds.json`, and
`content-seed-queue.md`. See `docs/crowdlisten-content-loop.md` for the workflow
and quality rules.

## Traveler agent skill

`skills/china-travel-companion/` is the traveler-facing planning and guide-audit
skill. It verifies current rules, turns caption or OCR text into reviewable place
candidates, and defines the shared-location handoff without claiming unsupported
URL fetching, image OCR, live collaboration, or map exports.

### Agent-Reach supply adapter

Agent-Reach can collect raw Reddit questions and Xiaohongshu place notes when
operator login state is available. Normalize those exports before reviewing them
in CrowdListen:

```sh
npm run capture:agent-reach -- --preflight --backend auto
npm run import:agent-reach -- pipeline/agent-reach-exports/china-backpacker.jsonl
npm run test:agent-reach-import
npm run report:agent-reach-gap
```

This writes `pipeline/agent-reach-normalized-seeds.json` and
`pipeline/agent-reach-gap-report.md`. See `docs/agent-reach-sourcing.md` for the
handoff shape, login boundaries, and comparison workflow.

## Deploy

Pushes to `main` build and deploy via GitHub Actions. See `DEPLOY.md` for
first-time repo/Pages/DNS setup.
