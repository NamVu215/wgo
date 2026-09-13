// Build-time data loading (Node only). Reads Google Sheets when configured, else local CSV.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DATA_SOURCE, CITY } from '../config.ts';
import { parsePlaces, parseRefs, type Issue, type Place, type Refs } from './data.ts';

type Tab = keyof typeof DATA_SOURCE.gid;

async function readTab(tab: Tab): Promise<string> {
  if (!DATA_SOURCE.sheetId) {
    // cwd is the project root for `astro build` and npm scripts.
    return readFile(join(process.cwd(), 'data', CITY.id, `${tab}.csv`), 'utf8');
  }
  const gid = DATA_SOURCE.gid[tab];
  if (!gid) throw new Error(`Chưa điền gid cho tab "${tab}" trong src/config.ts`);
  const url = `https://docs.google.com/spreadsheets/d/${DATA_SOURCE.sheetId}/export?format=csv&gid=${gid}`;
  const res = await fetch(url, { redirect: 'follow' });
  const type = res.headers.get('content-type') ?? '';
  // A private sheet redirects to an HTML login page instead of failing.
  if (!res.ok || !type.includes('text/csv')) {
    throw new Error(`Không đọc được tab "${tab}" từ Google Sheets (HTTP ${res.status}). Sheet đã chia sẻ "Bất kỳ ai có đường liên kết" chưa?`);
  }
  return res.text();
}

export type SiteData = Refs & { places: Place[]; issues: Issue[] };

let cached: Promise<SiteData> | undefined;

export function loadSiteData(): Promise<SiteData> {
  cached ??= (async () => {
    const [placesCsv, monCsv, loaiCsv, tagsCsv] = await Promise.all(
      (['dia-diem', 'mon', 'loai', 'tags'] as const).map(readTab),
    );
    const refs = parseRefs(monCsv, loaiCsv, tagsCsv);
    const { places, issues } = parsePlaces(placesCsv, refs);
    return { ...refs, places: places.filter((p) => p.thanhPho === CITY.id), issues };
  })();
  return cached;
}

export function formatIssues(issues: Issue[]): string {
  return issues
    .map((i) => `${i.muc === 'loi' ? 'LỖI     ' : 'Cảnh báo'}  dòng ${i.dong}${i.id ? ` (${i.id})` : ''}: ${i.noiDung}`)
    .join('\n');
}
