import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    updated: z.coerce.date(),
    order: z.number(),
    category: z.string(),
    icon: z.string().default('compass'),
    decision: z
      .object({
        bestFor: z.string(),
        doThis: z.string(),
        watchFor: z.string(),
      })
      .optional(),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          checked: z.coerce.date(),
        })
      )
      .default([]),
    faqs: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .default([]),
    mapPlaces: z
      .array(
        z.object({
          name: z.string(),
          localName: z.string().optional(),
          city: z.string(),
          note: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { guides };
