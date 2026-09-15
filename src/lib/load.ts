// Build-time data loading (Node only). Reads Google Sheets when configured, else local CSV.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DATA_SOURCE, CITY } from '../config.ts';
import { parsePlaces, parseRefs, type Issue, type Place, type Refs } from './data.ts';
import { preparePhoto, writeUsedPhotos } from './photo-cache.ts';
import { parseReviews, type Review } from './reviews.ts';

type Tab = keyof typeof DATA_SOURCE.gid;

// Google occasionally times out; a short retry keeps scheduled updates from failing.
async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  for (let i = 1; ; i++) {
    try {
      return await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30_000) });
    } catch (err) {
      if (i >= attempts) throw err;
      await new Promise((r) => setTimeout(r, 2000 * i));
    }
  }
}

async function readTab(tab: Tab): Promise<string> {
  // WGO_DU_LIEU=<folder> reads CSV files from that folder instead (for trying changes locally).
  const folder = process.env.WGO_DU_LIEU;
  if (folder || !DATA_SOURCE.sheetId) {
    // cwd is the project root for `astro build` and npm scripts.
    return readFile(join(folder ?? join(process.cwd(), 'data', CITY.id), `${tab}.csv`), 'utf8').catch((err) => {
      if (tab === 'danh-gia') return '';
      throw err;
    });
  }
  const gid = DATA_SOURCE.gid[tab];
  if (!gid && tab === 'danh-gia') return '';
  if (!gid) throw new Error(`Chưa điền gid cho tab "${tab}" trong src/config.ts`);
  const url = `https://docs.google.com/spreadsheets/d/${DATA_SOURCE.sheetId}/export?format=csv&gid=${gid}`;
  const res = await fetchWithRetry(url);
  const type = res.headers.get('content-type') ?? '';
  // A private sheet redirects to an HTML login page instead of failing.
  if (!res.ok || !type.includes('text/csv')) {
    throw new Error(`Không đọc được tab "${tab}" từ Google Sheets (HTTP ${res.status}). Sheet đã chia sẻ "Bất kỳ ai có đường liên kết" chưa?`);
  }
  return res.text();
}

export type SiteData = Refs & { places: Place[]; reviews: Review[]; issues: Issue[] };

let cached: Promise<SiteData> | undefined;

export function loadSiteData(): Promise<SiteData> {
  cached ??= (async () => {
    const [placesCsv, monCsv, loaiCsv, tagsCsv, reviewsCsv] = await Promise.all(
      (['dia-diem', 'mon', 'loai', 'tags', 'danh-gia'] as const).map(readTab),
    );
    const refs = parseRefs(monCsv, loaiCsv, tagsCsv);
    const parsed = parsePlaces(placesCsv, refs);
    const issues = [...parsed.issues];
    const places = await withPhotos(parsed.places.filter((p) => p.thanhPho === CITY.id), issues);
    const { reviews, issues: reviewIssues } = parseReviews(reviewsCsv, new Set(places.map((p) => p.id)));
    issues.push(...reviewIssues);
    return { ...refs, places, reviews, issues };
  })();
  return cached;
}

// Downloads and resizes photos (a few at a time); a failed photo is a warning, not an error.
async function withPhotos(places: Place[], issues: Issue[]): Promise<Place[]> {
  const jobs = places.flatMap((p) => p.anh.map((download) => ({ p, download })));
  const ids = new Map<string, string>();
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < jobs.length) {
      const { p, download } = jobs[next++];
      try {
        ids.set(download, await preparePhoto(download));
      } catch (err) {
        issues.push({ dong: p.dong, id: p.id, muc: 'canh-bao', noiDung: `ảnh: ${(err as Error).message}` });
      }
    }
  }));
  const result = places.map((p) => ({ ...p, anh: p.anh.flatMap((d) => ids.get(d) ?? []) }));
  await writeUsedPhotos(result.flatMap((p) => p.anh));
  return result;
}

export function formatIssues(issues: Issue[]): string {
  return issues
    .map((i) => `${i.muc === 'loi' ? 'LỖI     ' : 'Cảnh báo'}  dòng ${i.dong}${i.id ? ` (${i.id})` : ''}: ${i.noiDung}`)
    .join('\n');
}
