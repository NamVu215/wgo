// Writes dist/sw.js after the build: a service worker that precaches every page and asset
// so WGo opens without a network, and caches map tiles and photos the first time they are seen.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

// Cached on first use instead of up front (large, and only some of it is ever needed).
const LAZY = [/^nen-ban-do\//, /^anh\//];
const SKIP = [/^_headers$/, /^_redirects$/, /^robots\.txt$/, /^sw\.js$/, /\.map$/, /^vendor\/.*-dev\.mjs$/];

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])));
  return files.flat();
}

// "hue/bun-bo/index.html" → "/hue/bun-bo/", matching trailingSlash: 'always'.
function toUrl(path: string): string {
  const url = `/${path.split(sep).join('/')}`;
  if (url === '/404.html') return url;
  return url.endsWith('/index.html') ? url.slice(0, -'index.html'.length) : url;
}

export default function offline(): AstroIntegration {
  return {
    name: 'wgo-offline',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const hash = createHash('sha256');
        const precache: string[] = [];
        let bytes = 0;
        for (const file of (await walk(root)).sort()) {
          const rel = relative(root, file).split(sep).join('/');
          if (SKIP.some((re) => re.test(rel)) || LAZY.some((re) => re.test(rel))) continue;
          const content = await readFile(file);
          hash.update(rel).update(content);
          precache.push(toUrl(rel));
          bytes += content.length;
        }
        const template = await readFile(new URL('./sw-template.js', import.meta.url), 'utf8');
        const version = hash.digest('hex').slice(0, 12);
        const sw = template
          .replace('__VERSION__', version)
          .replace('__PRECACHE__', JSON.stringify(precache));
        await writeFile(join(root, 'sw.js'), sw);
        logger.info(`sw.js ${version}: ${precache.length} tệp lưu sẵn (${(bytes / 1e6).toFixed(2)} MB chưa nén)`);
      },
    },
  };
}
