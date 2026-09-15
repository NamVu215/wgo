// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import maplibre from './integrations/maplibre.ts';
import offline from './integrations/offline.ts';
import photos from './integrations/photos.ts';

export default defineConfig({
  site: 'https://wgo-auc.pages.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [maplibre(), photos(), offline()],
  // Fonts are downloaded at build time and served from WGo itself (works offline, no Google request).
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-bricolage',
      weights: [700, 800],
      styles: ['normal'],
      subsets: ['vietnamese', 'latin'],
      fallbacks: ['Arial Rounded MT Bold', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Be Vietnam Pro',
      cssVariable: '--font-be-vietnam',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['vietnamese', 'latin'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
  ],
});
