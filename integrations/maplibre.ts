// MapLibre GL 6 loads its web worker from a file next to the main module, which Vite cannot
// bundle. Copy the three prebuilt modules into public/vendor/ so they are served as-is.
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { AstroIntegration } from 'astro';

const FILES = ['maplibre-gl.mjs', 'maplibre-gl-shared.mjs', 'maplibre-gl-worker.mjs'];

export default function maplibre(): AstroIntegration {
  return {
    name: 'wgo-maplibre',
    hooks: {
      'astro:config:setup': async () => {
        const root = process.cwd();
        const pkgDir = join(root, 'node_modules', 'maplibre-gl');
        const { version } = JSON.parse(await readFile(join(pkgDir, 'package.json'), 'utf8'));
        const out = join(root, 'public', 'vendor', `maplibre-gl-${version}`);
        await mkdir(out, { recursive: true });
        for (const file of FILES) {
          if (!existsSync(join(out, file))) await copyFile(join(pkgDir, 'dist', file), join(out, file));
        }
      },
    },
  };
}
