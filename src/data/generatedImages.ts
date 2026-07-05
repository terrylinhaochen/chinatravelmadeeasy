import manifest from './generatedImageManifest.json';

export interface GeneratedImage {
  src: string;
  alt: string;
  source: string;
  title: string;
}

const assets = (manifest as { assets?: Record<string, GeneratedImage> }).assets ?? {};

export function getGeneratedImage(id: string): GeneratedImage | undefined {
  return assets[id];
}

export function requireGeneratedImage(id: string): GeneratedImage {
  const image = getGeneratedImage(id);
  if (!image) {
    throw new Error(`Missing curated image asset: ${id}. Run npm run images:generate.`);
  }
  return image;
}
