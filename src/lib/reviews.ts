// Community reviews from the `danh-gia` tab (rows copied there when the owner approves them).
import { csvToRecords } from './csv.ts';
import { normalizeDate, type Issue } from './data.ts';

export type Review = { ma: string; quan: string; sao: number; nhanXet: string; ten: string; ngay: string };
export type ReviewSummary = { count: number; average: number | null; latest: Review[] };

const MAX_TEXT = 600;
const MAX_NAME = 40;

export function parseReviews(csv: string, placeIds: Set<string>): { reviews: Review[]; issues: Issue[] } {
  const reviews: Review[] = [];
  const issues: Issue[] = [];
  const seen = new Set<string>();
  csvToRecords(csv).forEach((r, index) => {
    const dong = index + 2;
    const warn = (noiDung: string) => issues.push({ dong, id: r.quan ?? '', muc: 'canh-bao', noiDung: `danh-gia: ${noiDung}` });
    const quan = (r.quan ?? '').trim();
    const sao = Number((r.sao ?? '').trim());
    if (!quan && !r.sao) return;
    if (!placeIds.has(quan)) return warn(`quán "${quan}" không có (hoặc đang ẩn), bỏ qua`);
    if (!Number.isInteger(sao) || sao < 1 || sao > 5) return warn(`số sao "${r.sao ?? ''}" phải từ 1 đến 5, bỏ qua`);
    const ma = (r.ma ?? '').trim() || `dong-${dong}`;
    if (seen.has(ma)) return warn(`mã "${ma}" bị trùng, bỏ qua`);
    seen.add(ma);
    reviews.push({
      ma,
      quan,
      sao,
      nhanXet: (r.nhan_xet ?? '').trim().slice(0, MAX_TEXT),
      ten: (r.ten ?? '').trim().slice(0, MAX_NAME),
      ngay: normalizeDate(r.ngay ?? '') ?? '',
    });
  });
  return { reviews, issues };
}

export function summarize(reviews: Review[], quan: string, latest = 5): ReviewSummary {
  const mine = reviews.filter((r) => r.quan === quan).sort((a, b) => b.ngay.localeCompare(a.ngay));
  const average = mine.length ? mine.reduce((sum, r) => sum + r.sao, 0) / mine.length : null;
  return { count: mine.length, average, latest: mine.filter((r) => r.nhanXet).slice(0, latest) };
}

// "4,3" — one decimal, Vietnamese comma.
export const averageText = (avg: number) => (Math.round(avg * 10) / 10).toFixed(1).replace('.', ',');

// Prefilled Google Form link: the template holds __MA__ and __TEN__ placeholders.
export function formLink(template: string, place?: { id: string; ten: string }): string {
  if (!template) return '';
  return template
    .replace('__MA__', encodeURIComponent(place?.id ?? ''))
    .replace('__TEN__', encodeURIComponent(place?.ten ?? ''));
}
