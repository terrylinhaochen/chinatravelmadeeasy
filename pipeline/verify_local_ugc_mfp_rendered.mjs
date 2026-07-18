import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createServer } from 'node:net';

const distDir = resolve('dist');
const chromePath = process.env.CTME_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!existsSync(resolve(distDir, 'index.html'))) {
  throw new Error('dist/ is missing. Run `npm run build` before `npm run test:local-ugc-mfp:rendered`.');
}

async function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      server.close(() => resolvePort(port));
    });
  });
}

async function waitForServer(baseUrl, timeoutMs = 10000) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/discover/`);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 150));
  }
  throw new Error(`Static server did not become ready: ${lastError?.message || 'unknown error'}`);
}

function assertText(page, text, scope = 'page') {
  return page.getByText(text).count().then((count) => {
    if (!count) throw new Error(`${scope} missing rendered text: ${text}`);
  });
}

async function verifyDiscoverStatus(page, baseUrl) {
  await page.goto(`${baseUrl}/discover/`, { waitUntil: 'domcontentloaded' });
  for (const text of [
    'MFP status',
    'What is actually functional today?',
    'Reviewed Chinese local grid',
    'Proven in this slice',
    'Reviewed UGC packet',
    'Seeded locally',
    'A slow Yangpu riverfront day instead of a skyline checklist',
    'The riverfront walk works only if the weather and return route work',
    '下雨天风大，回程不好打车',
    'Use as timing and transport caveat, not as a map pin',
    'operator-reviewed seed',
    'UGC boundary',
    'Seeded from an operator-reviewed Chinese UGC-style caption. No live Xiaohongshu retrieval or platform ranking is claimed.',
    'Packet reviewed',
    'Provider checked',
    'Local grid mapping',
    'Source evidence',
    'Local-use fit',
    'Provider identity',
    'Traveler decision',
    'review cell',
    'saveable cell',
    'Save UGC-mapped pin',
    'Not live platform retrieval',
    'Compare with reviewed grid',
    'Add similar UGC lead',
    'UGC review packets',
    'Functional locally',
    'Map-ready save',
    'Live Chinese-platform retrieval',
    'Production provider resolver',
    'Not live yet',
  ]) {
    await assertText(page, text, 'Discover MFP status');
  }
}

async function verifyReviewedUgcSave(page, baseUrl) {
  await page.goto(`${baseUrl}/discover/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.getByRole('button', { name: 'Save UGC-mapped pin' }).click();
  await page.locator('#ctmeSigninEmail').fill('ugc-dogfood@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('Saved 1 UGC-mapped pin to Profile').waitFor();
  await page.getByRole('link', { name: 'Open Profile' }).click();
  await page.waitForURL(/profile/);

  for (const text of [
    'A slow Yangpu riverfront day instead of a skyline checklist',
    'Fuxing Island Park',
    'Open saved AMap pin',
    'Open saved Apple pin',
    'Review 1 unresolved local lead',
    'UGC boundary:',
    'Source evidence:',
    'Freshness:',
    'packet reviewed 2026-07-18',
    'provider checked 2026-07-18',
    'Save as the slow finish if the traveler wants neighborhood air rather than marquee sightseeing.',
    'Resolved: AMap and Apple identify the same park at 共青路386号.',
  ]) {
    await assertText(page, text, 'Profile saved UGC mapped pin');
  }
}

async function verifyUgcPacketToProfile(page, baseUrl) {
  await page.goto(`${baseUrl}/discover/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.getByRole('link', { name: 'Add Chinese source' }).click();
  await page.waitForURL(/map-import.*#contribute/);
  await page.locator('[name="originalName"]').fill('杨浦滨江小红书慢走');
  await page.locator('[name="sourceUrl"]').fill('https://www.xiaohongshu.com/explore/abc123');
  await page.locator('[name="evidenceText"]').fill('周末沿着杨浦滨江慢走，从绿之丘看江景，再去复兴岛公园散步，适合不赶景点的一天。');
  await page.locator('[name="whyItMatters"]').fill('This changes the route from a skyline checklist into a slow local waterfront day with one resolved park and several review-first leads.');
  await page.locator('[name="localUseSignal"]').selectOption('local-creator-ugc');
  await page.locator('[name="rightsConsent"]').check();
  await page.getByRole('button', { name: 'Prepare contribution' }).click();
  await page.getByText('Review packet ready', { exact: true }).waitFor();

  for (const text of [
    'Local grid review',
    'ready for local grid review · not map-ready',
    'Source evidence',
    'Local-use fit',
    'Provider identity',
    'Traveler decision',
  ]) {
    await assertText(page, text, 'UGC packet result');
  }

  await page.getByRole('link', { name: 'View in Profile' }).click();
  await page.waitForURL(/profile/);
  for (const text of [
    '杨浦滨江小红书慢走',
    'Provider match pending',
    'Local creator or resident UGC',
    'ready for local grid review · not map-ready',
    'Compare with reviewed local grid',
  ]) {
    await assertText(page, text, 'Profile UGC packet');
  }
}

async function verifyReviewedGridSave(page, baseUrl) {
  await page.goto(`${baseUrl}/curated/ctme-local-lens/what-yangpu-residents-use-on-a-slow-day/shanghai/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  for (const text of [
    'Trip role:',
    'Next action:',
    'Save now: AMap and Apple agree on the park identity at 共青路386号.',
    'Review before saving',
    'Keep as inspiration only',
  ]) {
    await assertText(page, text, 'reviewed local grid');
  }

  await page.getByRole('button', { name: 'Save 1 map-ready pin' }).click();
  await page.locator('#ctmeSigninEmail').fill('dogfood@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByText('Saved 1 map-ready pin to Profile').waitFor();
  await page.getByRole('link', { name: 'Open Profile' }).click();
  await page.waitForURL(/profile/);

  for (const text of [
    'Fuxing Island Park',
    'Trip role:',
    'Save as the slow finish for a Yangpu local-use day',
    'Next action:',
    'Save now: AMap and Apple agree on the park identity at 共青路386号.',
    'Review 3 unresolved local leads',
    'Open saved AMap pin',
    'Open saved Apple pin',
  ]) {
    await assertText(page, text, 'Profile saved local grid pin');
  }
}

const port = await getFreePort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', distDir], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderr = '';
server.stderr.on('data', (chunk) => {
  stderr += chunk.toString();
});

try {
  await waitForServer(baseUrl);
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1400 } });
  try {
    await verifyDiscoverStatus(page, baseUrl);
    await verifyReviewedUgcSave(page, baseUrl);
    await verifyUgcPacketToProfile(page, baseUrl);
    await verifyReviewedGridSave(page, baseUrl);
  } finally {
    await browser.close();
  }
  console.log(JSON.stringify({ ok: true, baseUrl, checks: ['discover-status', 'reviewed-ugc-save-profile', 'ugc-packet-profile', 'reviewed-grid-save-profile'] }));
} finally {
  server.kill('SIGTERM');
}

server.on('exit', (code) => {
  if (code && code !== 143 && stderr) process.stderr.write(stderr);
});
