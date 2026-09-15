// Vietnamese lunar calendar (UTC+7), after Hồ Ngọc Đức's well-known algorithm
// (https://www.informatik.uni-leipzig.de/~duc/amlich/). Valid roughly 1900–2100.

const TZ = 7;
const { PI, floor, sin } = Math;

export type LunarDate = { day: number; month: number; year: number; leap: boolean };

// Julian day number of a Gregorian date.
export function jdFromDate(d: number, m: number, y: number): number {
  const a = floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + floor((153 * mm + 2) / 5) + 365 * yy + floor(yy / 4) - floor(yy / 100) + floor(yy / 400) - 32045;
}

export function jdToDate(jd: number): { d: number; m: number; y: number } {
  const a = jd + 32044;
  const b = floor((4 * a + 3) / 146097);
  const c = a - floor((b * 146097) / 4);
  const d = floor((4 * c + 3) / 1461);
  const e = c - floor((1461 * d) / 4);
  const m = floor((5 * e + 2) / 153);
  return { d: e - floor((153 * m + 2) / 5) + 1, m: m + 3 - 12 * floor(m / 10), y: b * 100 + d - 4800 + floor(m / 10) };
}

// Julian date of the k-th new moon after 1900-01-01.
function newMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let jd = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  jd += 0.00033 * sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let c = (0.1734 - 0.000393 * T) * sin(M * dr) + 0.0021 * sin(2 * dr * M);
  c += -0.4068 * sin(Mpr * dr) + 0.0161 * sin(dr * 2 * Mpr) - 0.0004 * sin(dr * 3 * Mpr);
  c += 0.0104 * sin(dr * 2 * F) - 0.0051 * sin(dr * (M + Mpr)) - 0.0074 * sin(dr * (M - Mpr));
  c += 0.0004 * sin(dr * (2 * F + M)) - 0.0004 * sin(dr * (2 * F - M)) - 0.0006 * sin(dr * (2 * F + Mpr));
  c += 0.001 * sin(dr * (2 * F - Mpr)) + 0.0005 * sin(dr * (2 * Mpr + M));
  const deltaT = T < -11
    ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
    : -0.000278 + 0.000265 * T + 0.000262 * T2;
  return jd + c - deltaT;
}

// Sun longitude sector (0–11) at the start of a local day.
function sunSector(jdn: number): number {
  const T = (jdn - 0.5 - TZ / 24 - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const dl = (1.9146 - 0.004817 * T - 0.000014 * T2) * sin(dr * M) + (0.019993 - 0.000101 * T) * sin(dr * 2 * M) + 0.00029 * sin(dr * 3 * M);
  let L = (280.46645 + 36000.76983 * T + 0.0003032 * T2 + dl) * dr;
  L -= PI * 2 * floor(L / (PI * 2));
  return floor((L / PI) * 6);
}

const newMoonDay = (k: number) => floor(newMoon(k) + 0.5 + TZ / 24);

// Day number of the start of lunar month 11 (the month containing the winter solstice) of year y.
function month11(y: number): number {
  const k = floor((jdFromDate(31, 12, y) - 2415021) / 29.530588853);
  const nm = newMoonDay(k);
  return sunSector(nm) >= 9 ? newMoonDay(k - 1) : nm;
}

function leapMonthOffset(a11: number): number {
  const k = floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let i = 1;
  let arc = sunSector(newMoonDay(k + i));
  let last: number;
  do {
    last = arc;
    i++;
    arc = sunSector(newMoonDay(k + i));
  } while (arc !== last && i < 14);
  return i - 1;
}

const cache = new Map<number, LunarDate>();

export function lunarFromJd(jdn: number): LunarDate {
  const hit = cache.get(jdn);
  if (hit) return hit;
  const { y } = jdToDate(jdn);
  const k = floor((jdn - 2415021.076998695) / 29.530588853);
  let monthStart = newMoonDay(k + 1);
  if (monthStart > jdn) monthStart = newMoonDay(k);
  let a11 = month11(y);
  let b11 = a11;
  let year: number;
  if (a11 >= monthStart) {
    year = y;
    a11 = month11(y - 1);
  } else {
    year = y + 1;
    b11 = month11(y + 1);
  }
  const day = jdn - monthStart + 1;
  const diff = floor((monthStart - a11) / 29);
  let leap = false;
  let month = diff + 11;
  if (b11 - a11 > 365) {
    const leapDiff = leapMonthOffset(a11);
    if (diff >= leapDiff) {
      month = diff + 10;
      leap = diff === leapDiff;
    }
  }
  if (month > 12) month -= 12;
  if (month >= 11 && diff < 4) year -= 1;
  const result = { day, month, year, leap };
  if (cache.size > 500) cache.clear();
  cache.set(jdn, result);
  return result;
}

export const lunarFromDate = (d: number, m: number, y: number) => lunarFromJd(jdFromDate(d, m, y));
