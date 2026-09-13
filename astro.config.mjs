// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wgo.pages.dev',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
