// Serves/copies processed photos from .cache/anh (see src/lib/photo-cache.ts) at /anh/.
import { createReadStream, existsSync } from 'node:fs';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { PHOTO_SIZES } from '../src/lib/photos.ts';

const CACHE = join(process.cwd(), '.cache', 'anh');

export default function photos(): AstroIntegration {
  return {
    name: 'wgo-photos',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/anh/', (req, res, next) => {
          const name = (req.url ?? '').split('?')[0].replace(/^\//, '');
          const file = join(CACHE, name);
          if (!/^[a-f0-9]{16}-\d+\.webp$/.test(name) || !existsSync(file)) return next();
          res.setHeader('Content-Type', 'image/webp');
          createReadStream(file).pipe(res);
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const manifest = join(CACHE, 'dang-dung.json');
        if (!existsSync(manifest)) return;
        const ids: string[] = JSON.parse(await readFile(manifest, 'utf8'));
        if (ids.length === 0) return;
        const out = join(fileURLToPath(dir), 'anh');
        await mkdir(out, { recursive: true });
        let copied = 0;
        for (const id of ids) {
          for (const width of Object.values(PHOTO_SIZES)) {
            const name = `${id}-${width}.webp`;
            if (existsSync(join(CACHE, name))) {
              await copyFile(join(CACHE, name), join(out, name));
              copied++;
            }
          }
        }
        logger.info(`${copied} file ảnh`);
      },
    },
  };
}
