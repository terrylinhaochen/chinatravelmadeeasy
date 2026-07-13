// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { PUBLISHED_DESTINATION_SLUGS } from './src/utils/destinationQuality.js';

const publishedDestinations = new Set(PUBLISHED_DESTINATION_SLUGS);

// https://astro.build/config
export default defineConfig({
  site: 'https://chinatravelmadeeasy.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes('/curated/fanny-chen/') || page.includes('/videos/')) return false;
        const destination = new URL(page, 'https://chinatravelmadeeasy.com').pathname.match(/^\/regions\/([^/]+)\/$/)?.[1];
        return !destination || publishedDestinations.has(destination);
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
