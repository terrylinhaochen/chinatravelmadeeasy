# SEO audit: QA indexing pass

Date: 2026-06-22

## Goal

Make China Travel Made Easy easier for search engines and AI answer engines to crawl, understand, and retrieve as question-led travel guidance.

## Findings fixed

- Guide pages emitted malformed structured-data URLs such as `/guides//`.
- Guide pages emitted the site root as the article image instead of the guide cover image.
- Localized question pages were visually QA-style, but their structured data only described a generic web page.
- Topic discovery existed in navigation, but the Topics page did not yet expose topic intent as direct question-and-answer content.
- Region pages linked destinations to guides, but they did not yet contain destination-specific QA content.
- `llms.txt` did not list the newer Topics, Regions, localized QA, and Save Places surfaces.
- Content seeds used `QAPage` for a multi-question curated page. FAQ-style structured data better matches this page shape.

## Changes made

- Added Open Graph and Twitter image metadata support in the base layout.
- Fixed guide article URLs, guide article images, and article social previews.
- Added FAQ-style JSON-LD to English, Korean, and Japanese question pages.
- Reworked Topics into a question-led topic index with visible QA rows and FAQ-style JSON-LD.
- Added destination QA sections and FAQ-style JSON-LD to each region page.
- Updated `llms.txt` with Topics, Regions, localized QA pages, Save Places, and content-seed surfaces.

## Audit checklist

- Canonicals are generated from the deployed site URL and trailing-slash route.
- Sitemap generation is enabled through `@astrojs/sitemap`.
- `robots.txt` points to `https://chinatravelmadeeasy.com/sitemap-index.xml`.
- Guide pages expose Article structured data, BreadcrumbList structured data, FAQ structured data when guide FAQs exist, and a valid image URL.
- Multi-question pages use FAQ-style structured data rather than one-question QAPage markup.
- Localized pages include `hreflang` alternates for English, Korean, Japanese, and x-default.
- Machine-readable discovery includes `llms.txt`, `content-seeds.json`, sitemap output, and stable internal links.

## Follow-up after deploy

- Submit the deployed URL to Google's Rich Results Test for representative guide, question, topic, region, and content-seed pages.
- Inspect Search Console for indexed/crawled status after the sitemap is discovered.
- Keep high-risk travel claims dated in the guide body and update `dateModified` whenever guide front matter changes.
