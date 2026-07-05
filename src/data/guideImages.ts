import { requireGeneratedImage } from './generatedImages';

export type GuideImage = {
  src: string;
  alt: string;
};

export function getGuideImage(id: string): GuideImage {
  const generated = requireGeneratedImage(`guide:${id}`);
  return { src: generated.src, alt: generated.alt };
}
