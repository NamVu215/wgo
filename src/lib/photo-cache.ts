// Build time (Node only): downloads photos, makes small WebP copies in .cache/anh/.
// integrations/photos.ts copies the ones in use into the site.
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { PHOTO_SIZES } from './photos.ts';

export const PHOTO_CACHE = join(process.cwd(), '.cache', 'anh');
const MAX_BYTES = 25 * 1024 * 1024;

export const photoId = (download: string) => createHash('sha256').update(download).digest('hex').slice(0, 16);

const files = (id: string) => Object.values(PHOTO_SIZES).map((w) => join(PHOTO_CACHE, `${id}-${w}.webp`));

// Returns the photo id, or throws with a Vietnamese message.
export async function preparePhoto(download: string): Promise<string> {
  const id = photoId(download);
  if (files(id).every((f) => existsSync(f))) return id;

  let res: Response;
  try {
    res = await fetch(download, { redirect: 'follow', signal: AbortSignal.timeout(30_000) });
  } catch {
    throw new Error('không tải được ảnh (mạng lỗi hoặc quá lâu)');
  }
  const type = res.headers.get('content-type') ?? '';
  const drive = download.startsWith('https://drive.google.com/');
  if (!res.ok) {
    throw new Error(drive
      ? `Google Drive không cho tải (HTTP ${res.status}). Kiểm tra link và bật "Bất kỳ ai có đường liên kết"`
      : `không tải được ảnh (HTTP ${res.status})`);
  }
  if (type.includes('text/html')) throw new Error('link không trả về ảnh. Ảnh trên Drive đã bật "Bất kỳ ai có đường liên kết" chưa?');
  const body = Buffer.from(await res.arrayBuffer());
  if (body.length > MAX_BYTES) throw new Error('ảnh lớn hơn 25 MB');

  await mkdir(PHOTO_CACHE, { recursive: true });
  try {
    for (const width of Object.values(PHOTO_SIZES)) {
      const out = await sharp(body, { failOn: 'error' })
        .rotate()
        .resize({ width, height: Math.round(width * 1.25), fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 74 })
        .toBuffer();
      await writeFile(join(PHOTO_CACHE, `${id}-${width}.webp`), out);
    }
  } catch {
    throw new Error('file tải về không phải ảnh hợp lệ');
  }
  return id;
}

// Photos used by the current build, read by integrations/photos.ts.
export async function writeUsedPhotos(ids: string[]) {
  await mkdir(PHOTO_CACHE, { recursive: true });
  await writeFile(join(PHOTO_CACHE, 'dang-dung.json'), JSON.stringify([...new Set(ids)].sort()));
}
