// Lowercase, strip Vietnamese diacritics — for accent-insensitive search.
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// "30–45k", "200k", "Miễn phí", "" when unknown.
export function formatPrice(from: number | null, to: number | null): string {
  if (from === null && to === null) return '';
  if (from === 0 && (to === 0 || to === null)) return 'Miễn phí';
  const k = (v: number) => {
    const n = v / 1000;
    return Number.isInteger(n) ? `${n}` : n.toFixed(1).replace('.', ',');
  };
  if (from !== null && to !== null && from !== to) return `${k(from)}–${k(to)}k`;
  return `${k((from ?? to) as number)}k`;
}

// Accepts "16.48", "16,48" (Vietnamese-locale sheets).
export function parseDecimal(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, '');
  if (!s) return null;
  const normalized = s.includes('.') ? s.replace(/,/g, '') : s.replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

// Accepts "30000", "30.000", "30,000", "30k".
export function parseMoney(raw: string): number | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;
  const km = /^(\d+(?:[.,]\d+)?)\s*k$/.exec(s);
  if (km) return Math.round(Number(km[1].replace(',', '.')) * 1000);
  const digits = s.replace(/[.,\sđ₫]/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : null;
}

export function formatDateVi(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

export function splitList(raw: string): string[] {
  return raw.split('|').map((s) => s.trim()).filter(Boolean);
}
