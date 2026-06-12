# Deploying chinatravelmadeeasy.com

The site is fully static (Astro 5 → `dist/`), built and published by GitHub Actions
(`.github/workflows/deploy.yml`) to GitHub Pages with the custom domain
`chinatravelmadeeasy.com` (via `public/CNAME`).

> **Status note:** this project was generated in a sandboxed session where
> `npm install`, `git`, `gh`, and network access were permission-blocked.
> All source files are complete, but the steps below have NOT been executed yet —
> run them in order. They take about 10 minutes.

## 1. Install and verify the build locally

Requires Node 20+ (Node 22 recommended; available via `nvm use 22`).

```sh
cd /Users/terry/Desktop/chinatravelmadeeasy
npm install
npm run build        # must pass; outputs dist/
npm run preview      # optional: eyeball http://localhost:4321
```

## 2. Initialize git and commit

```sh
git init -b main
git add .gitignore package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "Scaffold Astro 5 + Tailwind static site"

git add src/styles src/layouts src/components src/pages src/content.config.ts public
git commit -m "Add layout, design system, pages, and SEO plumbing"

git add src/content
git commit -m "Add 10 China travel guides with FAQ schema frontmatter"

git add .github README.md DEPLOY.md public/CNAME public/llms.txt
git commit -m "Add GitHub Pages deploy workflow, CNAME, and docs"
```

(One `git add -A && git commit` also works if you don't care about commit granularity.)

## 3. Create the public repo and push

```sh
gh repo create terrylinhaochen/chinatravelmadeeasy --public \
  --source . --remote origin --push
```

If `gh` isn't authenticated: `gh auth login`, or create the repo in the GitHub UI
and `git remote add origin git@github.com:terrylinhaochen/chinatravelmadeeasy.git && git push -u origin main`.

## 4. Enable GitHub Pages (workflow build type)

```sh
gh api -X POST repos/terrylinhaochen/chinatravelmadeeasy/pages \
  -f build_type=workflow
```

Or in the UI: **Settings → Pages → Source: GitHub Actions**.

Then re-run the deploy workflow if the first push ran before Pages was enabled:

```sh
gh workflow run deploy.yml -R terrylinhaochen/chinatravelmadeeasy
```

## 5. Attach the custom domain

```sh
gh api -X PUT repos/terrylinhaochen/chinatravelmadeeasy/pages \
  -f cname=chinatravelmadeeasy.com
```

(UI: Settings → Pages → Custom domain → `chinatravelmadeeasy.com`.)
After DNS resolves (step 6), check **Enforce HTTPS** — GitHub provisions the
certificate automatically, usually within an hour of DNS propagating.

## 6. GoDaddy DNS records

In GoDaddy → My Products → chinatravelmadeeasy.com → DNS, set:

| Type  | Name | Value               | TTL |
|-------|------|---------------------|-----|
| A     | @    | 185.199.108.153     | 1h  |
| A     | @    | 185.199.109.153     | 1h  |
| A     | @    | 185.199.110.153     | 1h  |
| A     | @    | 185.199.111.153     | 1h  |
| CNAME | www  | terrylinhaochen.github.io | 1h  |

Notes:

- Delete GoDaddy's default "Parked" A record and any conflicting `@` A/AAAA records.
- Optional IPv6 (recommended): AAAA records on `@` pointing to
  `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- GoDaddy doesn't support ALIAS/ANAME on the apex, so the four A records are the
  correct approach.
- Propagation: minutes to a few hours. Verify with
  `dig chinatravelmadeeasy.com +short` (should return the four 185.199.x.153 IPs)
  and `dig www.chinatravelmadeeasy.com +short`.

## 7. Post-launch checklist

- [ ] `https://chinatravelmadeeasy.com/` loads with valid HTTPS (and `www` redirects).
- [ ] `https://chinatravelmadeeasy.com/sitemap-index.xml` resolves.
- [ ] Submit the sitemap in Google Search Console (verify the domain via a GoDaddy TXT record).
- [ ] Validate a guide page's FAQ/Article schema at https://search.google.com/test/rich-results.
- [ ] Spot-check `robots.txt` and `llms.txt`.

## How future deploys work

Push to `main` → the workflow runs `npm ci && npm run build` and publishes `dist/`
to Pages. No other steps needed. The CNAME file in `public/` keeps the custom
domain attached across deploys.
