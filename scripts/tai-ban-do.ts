// npm run tai-ban-do [-- vung-tau] [-- 20260914]
// Downloads the basemap for each city's bounds (or only the cities named) from a Protomaps daily build (OpenStreetMap data)
// into public/nen-ban-do/, so the map needs no third-party tile server or API key.
import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PMTiles } from 'pmtiles';
import { CITIES } from '../src/config.ts';

const args = process.argv.slice(2);
const wantedBuild = args.find((a) => /^\d{8}$/.test(a));
const named = args.filter((a) => !/^\d{8}$/.test(a));
const unknown = named.filter((id) => !CITIES.some((c) => c.id === id));
if (unknown.length) {
  console.error(`Không có thành phố: ${unknown.join(', ')}. Đang có: ${CITIES.map((c) => c.id).join(', ')}`);
  process.exit(1);
}
const cities = named.length ? CITIES.filter((c) => named.includes(c.id)) : CITIES;

// The map page never zooms out further than MIN_ZOOM, and overzooms past MAX_ZOOM.
const MIN_ZOOM = 10;
const MAX_ZOOM = 15;
const OUT = join(process.cwd(), 'public', 'nen-ban-do');
const ASSETS = 'https://protomaps.github.io/basemaps-assets';
const FONTS = ['Noto Sans Regular', 'Noto Sans Medium', 'Noto Sans Italic'];
// Latin, Latin Extended (ă đ ơ ư), combining accents, Vietnamese letters (ạ ả ấ …), punctuation.
const GLYPH_RANGES = ['0-255', '256-511', '768-1023', '7680-7935', '8192-8447'];
const SPRITES = ['light', 'dark'];

async function findBuild(): Promise<string> {
  const wanted = wantedBuild;
  const day = new Date();
  for (let i = 0; i < 10; i++) {
    const stamp = wanted ?? day.toISOString().slice(0, 10).replaceAll('-', '');
    const url = `https://build.protomaps.com/${stamp}.pmtiles`;
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) return url;
    if (wanted) break;
    day.setUTCDate(day.getUTCDate() - 1);
  }
  throw new Error('Không tìm thấy bản đồ Protomaps nào gần đây.');
}

const lngToX = (lng: number, z: number) => Math.floor(((lng + 180) / 360) * 2 ** z);
const latToY = (lat: number, z: number) => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
};

async function withRetry<T>(job: () => Promise<T>, attempts = 5): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await job();
    } catch (err) {
      if (i >= attempts) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

// Runs jobs a few at a time; the build server rejects large bursts.
async function pool(jobs: (() => Promise<void>)[], size = 6) {
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < jobs.length) await withRetry(jobs[next++]);
  }));
}

async function download(url: string, file: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  await mkdir(join(file, '..'), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
}

const build = await findBuild();
console.log(`Nguồn: ${build}`);
const archive = new PMTiles(build);
const header = await archive.getHeader();
let totalTiles = 0;
let totalBytes = 0;
for (const city of cities) {
  const [west, south, east, north] = city.bounds;

  // Download into a temporary folder so a failed run keeps the previous map.
  const cityDir = join(OUT, city.id);
  const tmpDir = `${cityDir}.tai`;
  await rm(tmpDir, { recursive: true, force: true });

  let count = 0;
  let bytes = 0;
  for (let z = Math.max(MIN_ZOOM, header.minZoom); z <= Math.min(MAX_ZOOM, header.maxZoom); z++) {
    const jobs: (() => Promise<void>)[] = [];
    for (let x = lngToX(west, z); x <= lngToX(east, z); x++) {
      for (let y = latToY(north, z); y <= latToY(south, z); y++) {
        jobs.push(async () => {
          const tile = await archive.getZxy(z, x, y);
          if (!tile) return;
          const file = join(tmpDir, String(z), String(x), `${y}.mvt`);
          await mkdir(join(file, '..'), { recursive: true });
          await writeFile(file, Buffer.from(tile.data));
          count++;
          bytes += tile.data.byteLength;
        });
      }
    }
    await pool(jobs);
    console.log(`  ${city.name} zoom ${z}: xong`);
  }

  await writeFile(join(tmpDir, 'nguon.json'), JSON.stringify({
    build, bounds: city.bounds, minzoom: Math.max(MIN_ZOOM, header.minZoom), maxzoom: Math.min(MAX_ZOOM, header.maxZoom), tiles: count,
  }, null, 2) + '\n');
  await rm(cityDir, { recursive: true, force: true });
  await rename(tmpDir, cityDir);
  console.log(`${city.name}: ${count} ô bản đồ (${(bytes / 1e6).toFixed(1)} MB)`);
  totalTiles += count;
  totalBytes += bytes;
}

for (const font of FONTS) {
  for (const range of GLYPH_RANGES) {
    await withRetry(() => download(`${ASSETS}/fonts/${encodeURIComponent(font)}/${range}.pbf`, join(OUT, 'fonts', font, `${range}.pbf`)));
  }
}
for (const name of SPRITES) {
  for (const suffix of ['', '@2x']) {
    for (const ext of ['json', 'png']) {
      await withRetry(() => download(`${ASSETS}/sprites/v4/${name}${suffix}.${ext}`, join(OUT, 'sprites', `${name}${suffix}.${ext}`)));
    }
  }
}

console.log(`Đã tải ${totalTiles} ô bản đồ (${(totalBytes / 1e6).toFixed(1)} MB) cho ${cities.map((c) => c.name).join(', ')}, cùng font chữ và biểu tượng.`);
