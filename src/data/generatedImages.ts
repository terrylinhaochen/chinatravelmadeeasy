import manifest from './generatedImageManifest.json';

export interface GeneratedImage {
  src: string;
  alt: string;
  source: string;
  title: string;
  prompt?: string;
}

const assets = (manifest as { assets?: Record<string, GeneratedImage> }).assets ?? {};

export function getGeneratedImage(id: string): GeneratedImage | undefined {
  return assets[id];
}
