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

Requires Node 20+.

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
- CNAME for the custom domain lives in `public/CNAME`

## Deploy

Pushes to `main` build and deploy via GitHub Actions. See `DEPLOY.md` for
first-time repo/Pages/DNS setup.
