#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'src/data/generatedImageManifest.json');
const guideDir = path.join(root, 'src/content/guides');
const regionImagesPath = path.join(root, 'src/data/regionImages.json');

const homeIds = ['home:hero', 'home:places', 'home:eating', 'home:traveling', 'home:hospitality'];

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function pathExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const manifest = await readJson(manifestPath);
  const assets = manifest.assets ?? {};
  const errors = [];
  if (manifest.generator !== 'curated-authentic-photo') {
    errors.push(`unexpected image manifest generator: ${manifest.generator}`);
  }
  const guideFiles = (await fs.readdir(guideDir))
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
  const regionImages = await readJson(regionImagesPath);
  const requiredIds = [
    ...homeIds,
    ...guideFiles.map((id) => `guide:${id}`),
    ...Object.keys(regionImages).map((slug) => `region:${slug}`),
  ];

  for (const id of requiredIds) {
    const asset = assets[id];
    if (!asset) {
      errors.push(`missing manifest asset: ${id}`);
      continue;
    }
    if (!asset.src?.startsWith('/images/curated/')) {
      errors.push(`${id} uses non-curated src: ${asset.src}`);
      continue;
    }
    const publicPath = path.join(root, 'public', asset.src);
    if (!(await pathExists(publicPath))) {
      errors.push(`${id} points to missing file: ${asset.src}`);
    }
    if (!asset.alt?.trim()) {
      errors.push(`${id} is missing alt text`);
    }
    if (!asset.source?.trim()) {
      errors.push(`${id} is missing source attribution`);
    }
    if (asset.prompt) {
      errors.push(`${id} still has prompt metadata; curated photos should not use image prompts`);
    }
  }

  if (errors.length > 0) {
    console.error(`Generated image verification failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Verified ${requiredIds.length} curated authentic image assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
