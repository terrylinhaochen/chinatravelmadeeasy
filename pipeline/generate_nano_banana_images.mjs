#!/usr/bin/env node
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const model = process.env.NANO_BANANA_MODEL || 'gemini-3.1-flash-image';
const geminiImageMime = process.env.GEMINI_IMAGE_MIME || 'image/jpeg';
const geminiImageExtension = geminiImageMime === 'image/png' ? 'png' : 'jpg';
const forceFallback = process.argv.includes('--fallback');
const dryRun = process.argv.includes('--dry-run');
const outDir = path.join(root, 'public/images/generated');
const manifestPath = path.join(root, 'src/data/generatedImageManifest.json');
const regionImagesPath = path.join(root, 'src/data/regionImages.json');
const geminiKeyEnvPaths = [
  path.join(root, '.env'),
  path.join(root, '.env.local'),
  '/Users/terry/Desktop/crowdlisten_files/platform/crowdlisten_deployed/frontend/.env.local',
  '/Users/terry/Desktop/crowdlisten_files/platform/crowdlisten_agent/crowdlisten-agent/.env',
  '/Users/terry/Desktop/crowdlisten_files/.env',
];

const style =
  'Sasi watercolor travel editorial style: translucent layered watercolor washes, quiet ink linework, cream paper grain, soft atmospheric edges, muted mineral pigments, no photorealism, no text, no logos, no watermark.';

const guideAssets = [
  ['guide:7-day-china-itinerary', 'great-wall-route', 'Great Wall ridge, Beijing roofs, Xian city wall, and Shanghai river lights arranged as a first-trip route map', 'Watercolor China first-trip route with Great Wall and city landmarks'],
  ['guide:alipay-wechat-pay-foreign-cards', 'mobile-payment', 'a traveler hand holding a phone with abstract QR payment squares beside a tea stall counter', 'Watercolor mobile payment setup scene in China'],
  ['guide:china-high-speed-trains', 'high-speed-train', 'a sleek high-speed train sliding past a station platform with pale rail lines and luggage silhouettes', 'Watercolor high-speed train at a China station'],
  ['guide:china-pre-departure-checklist', 'predeparture-checklist', 'passport, phone, train ticket, hotel address card, and suitcase arranged on a planning desk', 'Watercolor China pre-departure planning desk'],
  ['guide:china-visa-free-2026', 'visa-free-entry', 'passport stamps, arrival gate signage, and a route arrow through an airport concourse', 'Watercolor visa-free China entry planning scene'],
  ['guide:didi-metro-getting-around', 'city-transport', 'metro entrance, Didi pickup curb, traffic lights, and transit arrows in one calm city transport scene', 'Watercolor China city transport scene'],
  ['guide:festivals-and-local-experiences', 'festivals-local', 'lanterns, market banners, morning park dancers, and seasonal festival lights', 'Watercolor local China festival and park scene'],
  ['guide:food-ordering-dietary', 'food-ordering', 'QR menu, allergy note card, chopsticks, steaming bowls, and a small restaurant table', 'Watercolor food ordering and dietary card scene'],
  ['guide:hotels-foreigners-china', 'hotel-checkin', 'hotel reception desk, passport, room key card, and luggage under warm lobby light', 'Watercolor hotel check-in with foreign passport'],
  ['guide:internet-esim-vpn-blocked-apps', 'internet-esim', 'phone eSIM settings, signal waves, city skyline, and cloud icons over a travel map', 'Watercolor eSIM and internet setup scene'],
  ['guide:neighborhoods-beyond-landmarks', 'neighborhoods', 'hutong lane, longtang doorway, bicycles, plants, and quiet local street texture', 'Watercolor China neighborhood lane beyond landmarks'],
  ['guide:street-food-night-markets', 'street-food', 'night market stall, steam, skewers, bowls, and small QR payment sign in warm light', 'Watercolor China street food night market'],
  ['guide:tea-houses-and-rituals', 'tea-house', 'Chengdu tea table, gaiwan cups, bamboo chairs, and soft courtyard shade', 'Watercolor Chengdu tea house ritual scene'],
  ['guide:translation-language-survival', 'translation-language', 'street signs, camera translation overlay shapes, phrase card, and a traveler phone', 'Watercolor language translation survival scene'],
];

const homeAssets = [
  ['home:hero', 'home-hero', 'Shanghai skyline, river reflections, train line, lantern hint, and travel map marks composed as a quiet editorial hero', 'Watercolor China travel guide hero scene', '16:9'],
  ['home:places', 'home-places', 'Great Wall, river towns, skyline silhouettes, and route dots for comparing destinations', 'Watercolor China destination planning scene', '3:2'],
  ['home:eating', 'home-eating', 'tea house table, street food steam, menu card, chopsticks, and market lanterns', 'Watercolor China eating guide scene', '3:2'],
  ['home:traveling', 'home-traveling', 'high-speed train, metro sign, Didi pickup curb, and airport-to-hotel route line', 'Watercolor China transport guide scene', '3:2'],
  ['home:hospitality', 'home-hospitality', 'hotel lobby desk, passport, room card, suitcase, and neighborhood window', 'Watercolor China hotel and hospitality scene', '3:2'],
];

function svgForAsset(asset) {
  const hash = crypto.createHash('sha256').update(asset.id).digest();
  const colors = [
    ['#c7dfd4', '#efc3a7', '#c9bddf'],
    ['#bed8eb', '#e6b8c2', '#e9dcc5'],
    ['#d8cab6', '#b8d7cc', '#f0c7a7'],
    ['#d6d1e8', '#c5e0d7', '#efc6b1'],
  ][hash[0] % 4];
  const [a, b, c] = colors;
  const seed = [...hash.slice(0, 12)].map((n) => n / 255);
  const strokes = Array.from({ length: 14 }, (_, i) => {
    const x1 = 40 + seed[i % seed.length] * 1100;
    const y1 = 80 + seed[(i + 3) % seed.length] * 500;
    const x2 = 80 + seed[(i + 6) % seed.length] * 1060;
    const y2 = 90 + seed[(i + 9) % seed.length] * 480;
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} C ${(x1 + 160).toFixed(1)} ${(y1 - 90).toFixed(1)}, ${(x2 - 120).toFixed(1)} ${(y2 + 120).toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="#292524" stroke-opacity="${0.1 + (i % 5) * 0.025}" stroke-width="${1 + (i % 3)}"/>`;
  }).join('\n    ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" role="img" aria-label="${escapeXml(asset.alt)}">
  <defs>
    <filter id="paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="${hash[1]}" result="noise"/>
      <feColorMatrix type="saturate" values="0.25"/>
      <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>
    </filter>
    <filter id="bleed">
      <feGaussianBlur stdDeviation="24"/>
    </filter>
  </defs>
  <rect width="1200" height="760" fill="#f5f5f5"/>
  <g filter="url(#bleed)" opacity="0.9">
    <ellipse cx="${260 + seed[0] * 220}" cy="${170 + seed[1] * 180}" rx="${240 + seed[2] * 160}" ry="${150 + seed[3] * 120}" fill="${a}"/>
    <ellipse cx="${660 + seed[4] * 260}" cy="${260 + seed[5] * 220}" rx="${260 + seed[6] * 190}" ry="${180 + seed[7] * 140}" fill="${b}"/>
    <ellipse cx="${800 + seed[8] * 220}" cy="${500 + seed[9] * 150}" rx="${320 + seed[10] * 160}" ry="${150 + seed[11] * 120}" fill="${c}"/>
  </g>
  <g filter="url(#paper)">
    ${strokes}
    <path d="M120 610 C260 500 360 560 480 450 C610 330 760 430 900 300 C1000 210 1090 240 1140 200" fill="none" stroke="#292524" stroke-opacity="0.28" stroke-width="4"/>
    <circle cx="210" cy="590" r="9" fill="#292524" fill-opacity="0.25"/>
    <circle cx="515" cy="430" r="9" fill="#292524" fill-opacity="0.22"/>
    <circle cx="890" cy="315" r="9" fill="#292524" fill-opacity="0.2"/>
  </g>
</svg>`;
}

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[char]);
}

function assetFromTuple([id, slug, subject, alt, aspect = '16:9']) {
  return {
    id,
    slug,
    alt,
    aspect,
    prompt: `${style}\nSubject: ${subject}.\nComposition: spacious editorial travel illustration, useful as a website image crop, no readable text.`,
  };
}

async function loadAssets() {
  const regionImages = JSON.parse(await fs.readFile(regionImagesPath, 'utf8'));
  const regions = Object.entries(regionImages).map(([slug, image]) => assetFromTuple([
    `region:${slug}`,
    `region-${slug}`,
    `${image.title || slug} as a China travel planning destination, using ${image.alt || 'regional travel details'} as subject context`,
    `Watercolor destination illustration for ${image.title || slug}`,
    '16:9',
  ]));
  return [...homeAssets.map(assetFromTuple), ...guideAssets.map(assetFromTuple), ...regions];
}

async function writeFallback(asset) {
  const file = `${asset.slug}.svg`;
  await fs.writeFile(path.join(outDir, file), svgForAsset(asset));
  return `/images/generated/${file}`;
}

function findImageData(value) {
  if (!value || typeof value !== 'object') return null;
  if (typeof value.data === 'string' && (value.mime_type?.startsWith?.('image/') || value.mimeType?.startsWith?.('image/'))) {
    return value.data;
  }
  if (value.output_image?.data) return value.output_image.data;
  if (value.outputImage?.data) return value.outputImage.data;
  if (value.inline_data?.data) return value.inline_data.data;
  if (value.inlineData?.data) return value.inlineData.data;
  for (const nested of Object.values(value)) {
    if (Array.isArray(nested)) {
      for (const item of nested) {
        const found = findImageData(item);
        if (found) return found;
      }
    } else if (nested && typeof nested === 'object') {
      const found = findImageData(nested);
      if (found) return found;
    }
  }
  return null;
}

function readEnvValue(envPath, key) {
  if (!existsSync(envPath)) return null;
  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .find((value) => value.trim().startsWith(`${key}=`));
  if (!line) return null;
  return line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
}

function geminiApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (process.env.GOOGLE_AI_API_KEY) return process.env.GOOGLE_AI_API_KEY;
  if (process.env.VITE_GOOGLE_AI_API_KEY) return process.env.VITE_GOOGLE_AI_API_KEY;
  if (process.env.GOOGLE_API_KEY) return process.env.GOOGLE_API_KEY;
  if (process.env.GOOGLE_GENAI_API_KEY) return process.env.GOOGLE_GENAI_API_KEY;
  for (const envPath of geminiKeyEnvPaths) {
    const key =
      readEnvValue(envPath, 'GEMINI_API_KEY') ??
      readEnvValue(envPath, 'GOOGLE_AI_API_KEY') ??
      readEnvValue(envPath, 'VITE_GOOGLE_AI_API_KEY') ??
      readEnvValue(envPath, 'GOOGLE_API_KEY') ??
      readEnvValue(envPath, 'GOOGLE_GENAI_API_KEY');
    if (key) return key;
  }
  return null;
}

async function generateWithNanoBanana(asset) {
  const apiKey = geminiApiKey();
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [{ type: 'text', text: asset.prompt }],
      response_format: {
        type: 'image',
        mime_type: geminiImageMime,
        aspect_ratio: asset.aspect,
        image_size: '1K',
      },
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Nano Banana request failed for ${asset.id}: ${response.status} ${body}`);
  }
  const json = await response.json();
  const data = findImageData(json);
  if (!data) throw new Error(`Nano Banana response did not include image data for ${asset.id}`);
  const file = `${asset.slug}.${geminiImageExtension}`;
  await fs.writeFile(path.join(outDir, file), Buffer.from(data, 'base64'));
  return `/images/generated/${file}`;
}

async function main() {
  const assets = await loadAssets();
  const useFallback = forceFallback;
  const hasApiKey = Boolean(geminiApiKey());

  if (dryRun) {
    console.log(JSON.stringify({
      generator: useFallback ? 'local-watercolor-fallback' : 'nano-banana',
      model: useFallback ? null : model,
      assets: assets.length,
      hasApiKey,
      firstAsset: {
        id: assets[0]?.id,
        aspect: assets[0]?.aspect,
        prompt: assets[0]?.prompt,
      },
    }, null, 2));
    return;
  }

  if (!useFallback && !hasApiKey) {
    throw new Error(
      'GEMINI_API_KEY, GOOGLE_AI_API_KEY, VITE_GOOGLE_AI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY is required for Nano Banana generation. Use npm run images:fallback only when you intentionally want local preview placeholders.'
    );
  }

  await fs.mkdir(outDir, { recursive: true });
  const manifest = {
    generated_at: new Date().toISOString(),
    generator: useFallback ? 'local-watercolor-fallback' : 'nano-banana',
    model: useFallback ? null : model,
    note: useFallback
      ? 'Fallback SVGs were generated locally by explicit --fallback mode. Re-run npm run images:generate with Gemini credentials to create Nano Banana assets.'
      : 'Generated with Nano Banana via the Gemini Interactions API.',
    assets: {},
  };

  for (const asset of assets) {
    const src = useFallback ? await writeFallback(asset) : await generateWithNanoBanana(asset);
    manifest.assets[asset.id] = {
      src,
      alt: asset.alt,
      source: useFallback ? 'Local watercolor fallback for Nano Banana pipeline' : 'Nano Banana generated image',
      title: asset.id,
      prompt: asset.prompt,
    };
    console.log(`${asset.id} -> ${src}`);
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
