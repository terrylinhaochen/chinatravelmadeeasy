#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'public/images/curated');
const manifestPath = path.join(root, 'src/data/generatedImageManifest.json');
const regionImagesPath = path.join(root, 'src/data/regionImages.json');
const dryRun = process.argv.includes('--dry-run');
const onlyArg = process.argv.find((arg) => arg.startsWith('--only='));
const onlyId = onlyArg?.slice('--only='.length) || '';

const homeAssets = [
  ['home:hero', 'home-hero', 'public/images/curated/home-local-treasures.jpg', 'Night street storefront with Chinese calligraphy signs and warm lantern light', 'Local China night street storefront', '16:9'],
  ['home:places', 'home-places', 'public/images/great-wall.jpg', 'Great Wall landscape in northern China', 'Great Wall', '3:2'],
  ['home:eating', 'home-eating', 'public/images/china-street-food.jpg', 'Street food stall in China', 'China street food', '3:2'],
  ['home:traveling', 'home-traveling', 'public/images/china-high-speed-train.jpg', 'High-speed train at a China rail platform', 'China high-speed rail', '3:2'],
  ['home:hospitality', 'home-hospitality', 'public/images/china-hotel-lobby.jpg', 'Hotel lobby in China', 'China hotel lobby', '3:2'],
];

const guideAssets = [
  ['guide:7-day-china-itinerary', 'great-wall-route', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Forbidden_City_Beijing_China_(164849005).jpeg', 'Forbidden City palace roofs for a first China itinerary', 'Forbidden City Beijing China'],
  ['guide:china-attraction-tickets-reservations', 'great-wall-route', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Forbidden_City_Beijing_China_(164849005).jpeg', 'Palace Museum courtyards in Beijing for attraction ticket and entrance planning', 'Forbidden City Beijing China'],
  ['guide:alipay-wechat-pay-foreign-cards', 'mobile-payment', 'public/images/china-mobile-payment-qr.jpg', 'Mobile payment QR codes in China', 'Mobile payment QR codes'],
  ['guide:china-high-speed-trains', 'high-speed-train', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/China-Railway-Ticket-Paper-Normal.jpg', 'China railway ticket detail for train booking planning', 'China Railway Ticket'],
  ['guide:china-pre-departure-checklist', 'predeparture-checklist', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Beijing_Capital_Departure_Hall.jpg', 'Airport departure hall in China for pre-flight planning', 'Beijing Capital Departure Hall'],
  ['guide:china-visa-free-2026', 'visa-free-entry', 'public/images/china-immigration.jpg', 'China immigration and arrival area', 'China immigration'],
  ['guide:didi-metro-getting-around', 'city-transport', 'public/images/shanghai-metro-entrance.jpg', 'Shanghai metro entrance for city transport', 'Shanghai metro entrance'],
  ['guide:festivals-and-local-experiences', 'festivals-local', 'public/images/chinese-lanterns.jpg', 'Chinese lanterns during a local festival', 'Chinese lanterns'],
  ['guide:food-ordering-dietary', 'food-ordering', 'public/images/chinese-restaurant-interior.jpg', 'Restaurant interior in China', 'Chinese restaurant interior'],
  ['guide:hotels-foreigners-china', 'hotel-checkin', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hotel_Reception_.jpg', 'Hotel reception desk for China check-in planning', 'Hotel Reception'],
  ['guide:internet-esim-vpn-blocked-apps', 'internet-esim', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Huawei_Store_at_One_Avenue_in_Shenzhen%2C_China.jpg', 'Smartphone store in Shenzhen for China mobile setup planning', 'Huawei Store at One Avenue in Shenzhen'],
  ['guide:neighborhoods-beyond-landmarks', 'neighborhoods', 'public/images/beijing-hutong.jpg', 'Residential hutong lane in Beijing', 'Beijing hutong'],
  ['guide:street-food-night-markets', 'street-food', 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Muslim_food_street_market%2C_Xi%27an%2C_China_-_panoramio.jpg', "Xi'an Muslim food street market at night", "Muslim food street market, Xi'an"],
  ['guide:tea-houses-and-rituals', 'tea-house', 'public/images/chengdu-tea-shop.jpg', 'Tea shop in Chengdu', 'Chengdu tea shop'],
  ['guide:translation-language-survival', 'translation-language', 'public/images/china-street-signs.jpg', 'Chinese street signs for translation planning', 'China street signs'],
];

const aspectSizes = {
  '16:9': { width: 1376, height: 768 },
  '3:2': { width: 1264, height: 848 },
};

const manifestAliases = {
  'home:hero': '/images/curated/home-local-treasures.jpg',
  'guide:china-attraction-tickets-reservations': '/images/curated/great-wall-route.jpg',
  'region:guangzhou': '/images/curated/region-guangdong.jpg',
  'region:shenzhen': '/images/curated/internet-esim.jpg',
  'region:xian': '/images/curated/region-shaanxi.jpg',
  'region:chengdu': '/images/curated/region-sichuan.jpg',
  'region:hangzhou': '/images/curated/region-zhejiang.jpg',
  'region:lijiang': '/images/curated/region-yunnan.jpg',
  'region:yangshuo': '/images/curated/region-guangxi.jpg',
};

const manifestSourceAliases = {
  'home:hero': 'User-provided WeChat photo: WechatIMG4641.jpg',
};

function assetFromTuple([id, slug, source, alt, title, aspect = '16:9']) {
  return { id, slug, source, alt, title, aspect };
}

async function pathExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function loadAssets() {
  const regionImages = JSON.parse(await fs.readFile(regionImagesPath, 'utf8'));
  const regions = [];
  for (const [slug, image] of Object.entries(regionImages)) {
    const localRegionSource = `public/images/regions/${slug}.jpg`;
    const source = await pathExists(path.join(root, localRegionSource)) ? localRegionSource : image.src;
    regions.push(assetFromTuple([
      `region:${slug}`,
      `region-${slug}`,
      source,
      image.alt || `Authentic travel photo for ${image.title || slug}`,
      image.title || image.alt || slug,
      '16:9',
    ]));
  }
  return [...homeAssets.map(assetFromTuple), ...guideAssets.map(assetFromTuple), ...regions];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readSourceImage(asset) {
  if (asset.source.startsWith('http://') || asset.source.startsWith('https://')) {
    for (let attempt = 1; attempt <= 4; attempt++) {
      const response = await fetch(asset.source, {
        headers: {
          'User-Agent': 'ChinaTravelMadeEasy/1.0 authentic image curation pipeline (https://chinatravelmadeeasy.com/)',
        },
      });
      if (response.ok) return Buffer.from(await response.arrayBuffer());
      if (response.status !== 429 || attempt === 4) {
        throw new Error(`Failed to download ${asset.id} source image: ${response.status} ${response.statusText}`);
      }
      await wait(2500 * attempt);
    }
  }
  return fs.readFile(path.join(root, asset.source));
}

function publicSource(source) {
  return source.startsWith('http') ? source : source.replace(/^public\//, '/');
}

async function renderAsset(asset) {
  const size = aspectSizes[asset.aspect] ?? aspectSizes['16:9'];
  const source = await readSourceImage(asset);
  const file = `${asset.slug}.jpg`;
  await sharp(source, { limitInputPixels: false })
    .rotate()
    .resize(size.width, size.height, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(outDir, file));
  return `/images/curated/${file}`;
}

async function main() {
  const allAssets = await loadAssets();
  const assets = onlyId ? allAssets.filter((asset) => asset.id === onlyId) : allAssets;

  if (onlyId && assets.length === 0) throw new Error(`Unknown image asset id: ${onlyId}`);

  if (dryRun) {
    console.log(JSON.stringify({
      generator: 'curated-authentic-photo',
      assets: assets.length,
      firstAsset: {
        id: assets[0]?.id,
        source: assets[0]?.source,
        aspect: assets[0]?.aspect,
      },
    }, null, 2));
    return;
  }

  await fs.mkdir(outDir, { recursive: true });
  const existingManifest = onlyId
    ? JSON.parse(await fs.readFile(manifestPath, 'utf8'))
    : null;
  const manifest = {
    prepared_at: new Date().toISOString(),
    generator: 'curated-authentic-photo',
    model: null,
    note: 'Prepared from authentic source photographs by pipeline/prepare_curated_images.mjs. The pipeline only crops, resizes, and compresses real photos for site performance; it does not use AI image generation or style transfer.',
    assets: existingManifest?.assets ?? {},
  };

  for (const asset of assets) {
    const src = manifestAliases[asset.id] ?? await (async () => {
      if (asset.source.startsWith('http')) await wait(800);
      return renderAsset(asset);
    })();
    manifest.assets[asset.id] = {
      src,
      alt: asset.alt,
      source: manifestSourceAliases[asset.id] ?? publicSource(asset.source),
      title: asset.title,
    };
    console.log(`${asset.id} -> ${src}`);
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
