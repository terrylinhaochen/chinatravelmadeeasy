# China Travel Made Easy

Practical travel guides for first-time foreign visitors to China who don't speak the language.
Live at [chinatravelmadeeasy.com](https://chinatravelmadeeasy.com).

## Stack

- [Astro 5](https://astro.build) — fully static output
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- Markdown content collections (`src/content/guides/`)
- GitHub Pages + GitHub Actions deploy (see `.github/workflows/deploy.yml`)
- Zero backend, zero paid services

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview
```

Requires Node 22+.

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

## Generated imagery

The site uses generated Sasi watercolor assets from `public/images/generated`.
`npm run build` verifies that every homepage, guide, and region image points at a
generated asset before Astro builds.

```sh
npm run images:verify   # checks manifest coverage and generated files
npm run images:check    # dry-runs the 53 Nano Banana prompts
npm run images:fallback # intentionally writes local SVG preview assets
GEMINI_API_KEY=... npm run images:generate
```

`images:generate` requires `GEMINI_API_KEY`, `GOOGLE_API_KEY`, or
`GOOGLE_GENAI_API_KEY`; it will not silently fall back to placeholders.

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

## Deploy

Pushes to `main` build and deploy via GitHub Actions. See `DEPLOY.md` for
first-time repo/Pages/DNS setup.
