// Opening-hours parsing and "open now" logic. All times are Vietnam local time.
import { jdFromDate, lunarFromJd } from './lunar.ts';

// Minutes from 00:00 of the day the range starts. `end` may exceed 1440 (past midnight).
export type Range = { start: number; end: number };
export type LunarDay = 'ram' | 'mung-1';
export type Hours = {
  ranges: Range[]; // empty = hours unknown
  daysOff: number[]; // 0 = Sunday … 6 = Saturday
  lunarOff: LunarDay[];
};

// `jd` is the Julian day number of today's date in Vietnam. Without it, lunar days off are not checked.
export type VnNow = { day: number; minutes: number; jd?: number };

export type Status =
  | { kind: 'unknown' }
  | { kind: 'open'; closesAt: number; allDay: boolean }
  | { kind: 'closed'; opensAt: number | null; inDays: number; nghiHomNay?: LunarDay };

const DAY_TOKENS: Record<string, number> = { CN: 0, T2: 1, T3: 2, T4: 3, T5: 4, T6: 5, T7: 6 };
export const DAY_NAMES = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const DAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const LUNAR_NAMES: Record<LunarDay, string> = { ram: 'rằm', 'mung-1': 'mùng 1' };

const RANGE_RE = /^(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})$/;

export function parseHours(gio: string, nghi: string): { hours: Hours; errors: string[] } {
  const errors: string[] = [];
  const ranges: Range[] = [];
  const daysOff: number[] = [];
  const lunarOff: LunarDay[] = [];

  for (const part of gio.split(',').map((s) => s.trim()).filter(Boolean)) {
    const m = RANGE_RE.exec(part);
    if (!m) {
      errors.push(`giờ "${part}" không đúng dạng HH:MM-HH:MM`);
      continue;
    }
    const [sh, sm, eh, em] = m.slice(1).map(Number);
    const start = sh * 60 + sm;
    let end = eh * 60 + em;
    if (sh > 23 || sm > 59 || eh > 24 || em > 59 || (eh === 24 && em > 0)) {
      errors.push(`giờ "${part}" không hợp lệ`);
      continue;
    }
    if (end <= start) end += 1440;
    ranges.push({ start, end });
  }
  ranges.sort((a, b) => a.start - b.start);

  for (const raw of nghi.split(/[|,]/).map((s) => s.trim()).filter(Boolean)) {
    const upper = raw.toUpperCase();
    const lower = raw.toLowerCase();
    if (upper in DAY_TOKENS) daysOff.push(DAY_TOKENS[upper]);
    else if (lower === 'ram' || lower === 'rằm') lunarOff.push('ram');
    else if (lower === 'mung-1' || lower === 'mùng-1' || lower === 'mung1') lunarOff.push('mung-1');
    else errors.push(`ngày nghỉ "${raw}" không hiểu (dùng T2…T7, CN, ram, mung-1)`);
  }

  return { hours: { ranges, daysOff, lunarOff }, errors };
}

export function vnNow(date: Date = new Date()): VnNow {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const jd = jdFromDate(Number(get('day')), Number(get('month')), Number(get('year')));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')), jd };
}

export function lunarDayOff(h: Hours, jd: number): LunarDay | null {
  if (h.lunarOff.length === 0) return null;
  const { day } = lunarFromJd(jd);
  if (day === 15 && h.lunarOff.includes('ram')) return 'ram';
  if (day === 1 && h.lunarOff.includes('mung-1')) return 'mung-1';
  return null;
}

function isDayOff(h: Hours, now: VnNow, offset: number): boolean {
  if (h.daysOff.includes((now.day + offset + 7 * 2) % 7)) return true;
  return now.jd !== undefined && lunarDayOff(h, now.jd + offset) !== null;
}

// Next lunar day off from today (inclusive), within ~2 months.
export function nextLunarOff(h: Hours, jd: number): { jd: number; kind: LunarDay } | null {
  for (let i = 0; i < 62; i++) {
    const kind = lunarDayOff(h, jd + i);
    if (kind) return { jd: jd + i, kind };
  }
  return null;
}

export function getStatus(h: Hours, now: VnNow): Status {
  if (h.ranges.length === 0) return { kind: 'unknown' };

  // A range from yesterday may still be running past midnight.
  for (const offset of [0, 1]) {
    if (isDayOff(h, now, -offset)) continue;
    const t = now.minutes + offset * 1440;
    for (const r of h.ranges) {
      if (r.start <= t && t < r.end) {
        const allDay = r.start === 0 && r.end === 1440 && h.daysOff.length === 0;
        return { kind: 'open', closesAt: r.end % 1440, allDay };
      }
    }
  }

  const lunarToday = now.jd === undefined ? null : lunarDayOff(h, now.jd);
  const reason = lunarToday ? { nghiHomNay: lunarToday } : {};
  for (let inDays = 0; inDays <= 7; inDays++) {
    if (isDayOff(h, now, inDays)) continue;
    const next = h.ranges.find((r) => inDays > 0 || r.start > now.minutes);
    if (next) return { kind: 'closed', opensAt: next.start, inDays, ...reason };
  }
  return { kind: 'closed', opensAt: null, inDays: 0, ...reason };
}

export function hhmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export type StatusLabel = { text: string; tone: 'open' | 'closed' | 'unknown' };

export function statusLabel(s: Status, now: VnNow): StatusLabel {
  if (s.kind === 'unknown') return { text: 'Chưa rõ giờ', tone: 'unknown' };
  if (s.kind === 'open') {
    return { text: s.allDay ? 'Mở cả ngày' : `Đang mở · tới ${hhmm(s.closesAt)}`, tone: 'open' };
  }
  const head = s.nghiHomNay ? `Nghỉ ${LUNAR_NAMES[s.nghiHomNay]}` : 'Đã đóng';
  if (s.opensAt === null) return { text: head, tone: 'closed' };
  const at = hhmm(s.opensAt);
  if (s.inDays === 0) return { text: `${head} · mở lúc ${at}`, tone: 'closed' };
  if (s.inDays === 1) return { text: `${head} · mở lại ${at} ngày mai`, tone: 'closed' };
  const day = DAY_NAMES[(now.day + s.inDays) % 7];
  return { text: `${head} · mở lại ${day} ${at}`, tone: 'closed' };
}

// "18:00–23:00 · 06:00–10:00"
export function hoursText(h: Hours): string {
  if (h.ranges.length === 0) return 'Chưa rõ giờ';
  if (h.ranges.length === 1 && h.ranges[0].start === 0 && h.ranges[0].end === 1440) return 'Cả ngày';
  return h.ranges.map((r) => `${hhmm(r.start)}–${r.end === 1440 ? '24:00' : hhmm(r.end % 1440)}`).join(' · ');
}

// Compact form for small tiles: "18–23h", "6:30–11h", "2 buổi".
export function hoursShort(h: Hours): string {
  if (h.ranges.length === 0) return '—';
  if (h.ranges.length > 1) return `${h.ranges.length} buổi`;
  const r = h.ranges[0];
  if (r.start === 0 && r.end === 1440) return 'Cả ngày';
  const fmt = (min: number) => {
    const hh = Math.floor(min / 60);
    const mm = min % 60;
    return mm === 0 ? `${hh}` : `${hh}:${String(mm).padStart(2, '0')}`;
  };
  return `${fmt(r.start)}–${fmt(r.end === 1440 ? 1440 : r.end % 1440)}h`;
}

export function daysOffText(h: Hours): string {
  const parts = [...h.daysOff].sort().map((d) => DAY_SHORT[d]);
  if (h.lunarOff.includes('ram')) parts.push('rằm');
  if (h.lunarOff.includes('mung-1')) parts.push('mùng 1 âm lịch');
  return parts.join(', ');
}

export type Buoi = 'sang' | 'trua' | 'chieu' | 'toi' | 'khuya';

export const BUOI: Record<Buoi, { label: string; from: number; to: number }> = {
  sang: { label: 'Sáng', from: 5 * 60, to: 10 * 60 + 30 },
  trua: { label: 'Trưa', from: 10 * 60 + 30, to: 14 * 60 },
  chieu: { label: 'Chiều', from: 14 * 60, to: 17 * 60 },
  toi: { label: 'Tối', from: 17 * 60, to: 21 * 60 },
  khuya: { label: 'Khuya', from: 21 * 60, to: 26 * 60 },
};

export function currentBuoi(minutes: number): Buoi {
  if (minutes >= BUOI.sang.from && minutes < BUOI.sang.to) return 'sang';
  if (minutes >= BUOI.trua.from && minutes < BUOI.trua.to) return 'trua';
  if (minutes >= BUOI.chieu.from && minutes < BUOI.chieu.to) return 'chieu';
  if (minutes >= BUOI.toi.from && minutes < BUOI.toi.to) return 'toi';
  return 'khuya';
}

// True when any opening range overlaps the given part of the day (ignores days off).
export function openDuring(h: Hours, buoi: Buoi): boolean {
  const { from, to } = BUOI[buoi];
  return h.ranges.some((r) =>
    [-1440, 0, 1440].some((shift) => r.start < to + shift && from + shift < r.end),
  );
}
