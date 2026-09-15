import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseHours, getStatus, statusLabel, hoursText, hoursShort, openDuring, currentBuoi, vnNow, daysOffText, nextLunarOff,
} from '../src/lib/hours.ts';
import { jdFromDate } from '../src/lib/lunar.ts';

const at = (day: number, hh: number, mm = 0) => ({ day, minutes: hh * 60 + mm });
const h = (gio: string, nghi = '') => {
  const r = parseHours(gio, nghi);
  assert.deepEqual(r.errors, []);
  return r.hours;
};

test('one range: open inside, closed before and after', () => {
  const hours = h('06:00-10:00');
  assert.deepEqual(getStatus(hours, at(1, 7)), { kind: 'open', closesAt: 600, allDay: false });
  assert.deepEqual(getStatus(hours, at(1, 5, 59)), { kind: 'closed', opensAt: 360, inDays: 0 });
  assert.deepEqual(getStatus(hours, at(1, 10)), { kind: 'closed', opensAt: 360, inDays: 1 });
});

test('two ranges: gap between them opens later today', () => {
  const hours = h('06:00-10:00, 15:00-20:00');
  assert.deepEqual(getStatus(hours, at(3, 12)), { kind: 'closed', opensAt: 900, inDays: 0 });
  assert.equal(getStatus(hours, at(3, 16)).kind, 'open');
  assert.equal(hoursText(hours), '06:00–10:00 · 15:00–20:00');
  assert.equal(hoursShort(hours), '2 buổi');
});

test('past midnight: still open after 00:00 from yesterday', () => {
  const hours = h('18:00-01:00');
  assert.deepEqual(getStatus(hours, at(0, 0, 30)), { kind: 'open', closesAt: 60, allDay: false });
  assert.equal(getStatus(hours, at(0, 1)).kind, 'closed');
  assert.equal(getStatus(hours, at(6, 23)).kind, 'open');
  assert.equal(hoursText(hours), '18:00–01:00');
  assert.equal(hoursShort(hours), '18–1h');
});

test('past midnight respects yesterday being a day off', () => {
  const hours = h('18:00-01:00', 'T2');
  // Tuesday 00:30: the Monday shift never happened.
  assert.equal(getStatus(hours, at(2, 0, 30)).kind, 'closed');
  // Monday 00:30: Sunday's shift is still running.
  assert.equal(getStatus(hours, at(1, 0, 30)).kind, 'open');
});

test('all day', () => {
  const hours = h('00:00-24:00');
  const s = getStatus(hours, at(4, 3));
  assert.deepEqual(s, { kind: 'open', closesAt: 0, allDay: true });
  assert.equal(statusLabel(s, at(4, 3)).text, 'Mở cả ngày');
  assert.equal(hoursText(hours), 'Cả ngày');
});

test('day off skips to the next working day', () => {
  const hours = h('06:00-10:00', 'T2');
  // Sunday 11:00 → Monday off → Tuesday 06:00
  const s = getStatus(hours, at(0, 11));
  assert.deepEqual(s, { kind: 'closed', opensAt: 360, inDays: 2 });
  assert.equal(statusLabel(s, at(0, 11)).text, 'Đã đóng · mở lại Thứ Ba 06:00');
  assert.equal(getStatus(hours, at(1, 7)).kind, 'closed');
});

test('unknown hours', () => {
  const hours = h('');
  assert.deepEqual(getStatus(hours, at(2, 9)), { kind: 'unknown' });
  assert.equal(statusLabel({ kind: 'unknown' }, at(2, 9)).text, 'Chưa rõ giờ');
  assert.equal(hoursShort(hours), '—');
});

test('labels', () => {
  assert.equal(statusLabel({ kind: 'open', closesAt: 1380, allDay: false }, at(0, 19)).text, 'Đang mở · tới 23:00');
  assert.equal(statusLabel({ kind: 'closed', opensAt: 360, inDays: 1 }, at(0, 19)).text, 'Đã đóng · mở lại 06:00 ngày mai');
  assert.equal(statusLabel({ kind: 'closed', opensAt: 900, inDays: 0 }, at(0, 12)).text, 'Đã đóng · mở lúc 15:00');
});

test('bad input reports errors instead of throwing', () => {
  const r = parseHours('6h-10h, 25:00-26:00', 'thu hai');
  assert.equal(r.errors.length, 3);
  assert.deepEqual(r.hours.ranges, []);
});

test('lunar days are parsed', () => {
  const hours = h('06:00-10:00', 'ram|mung-1|CN');
  assert.deepEqual(hours.lunarOff, ['ram', 'mung-1']);
  assert.equal(daysOffText(hours), 'CN, rằm, mùng 1 âm lịch');
});

// Vietnam date + time, with weekday derived from the date.
const onDate = (iso: string, hh: number, mm = 0) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { day: new Date(Date.UTC(y, m - 1, d)).getUTCDay(), minutes: hh * 60 + mm, jd: jdFromDate(d, m, y) };
};

test('closed on rằm: 2026-09-25 is 15/8 lunar (Trung thu)', () => {
  const hours = h('06:00-10:00', 'ram');
  const now = onDate('2026-09-25', 7);
  const s = getStatus(hours, now);
  assert.deepEqual(s, { kind: 'closed', opensAt: 360, inDays: 1, nghiHomNay: 'ram' });
  assert.equal(statusLabel(s, now).text, 'Nghỉ rằm · mở lại 06:00 ngày mai');
  // The day before and after are normal days.
  assert.equal(getStatus(hours, onDate('2026-09-24', 7)).kind, 'open');
  assert.equal(getStatus(hours, onDate('2026-09-26', 7)).kind, 'open');
});

test('closed on mùng 1: Tết 2027 is 2027-02-06', () => {
  const hours = h('06:00-10:00', 'mung-1');
  assert.equal(getStatus(hours, onDate('2027-02-06', 8)).kind, 'closed');
  // Evening before mùng 1: next opening skips the lunar day off.
  assert.deepEqual(getStatus(hours, onDate('2027-02-05', 12)), { kind: 'closed', opensAt: 360, inDays: 2 });
});

test('past-midnight shift started on a lunar day off never happened', () => {
  const hours = h('18:00-01:00', 'ram');
  assert.equal(getStatus(hours, onDate('2026-09-26', 0, 30)).kind, 'closed');
  assert.equal(getStatus(hours, onDate('2026-09-25', 0, 30)).kind, 'open');
});

test('next lunar day off', () => {
  const hours = h('06:00-10:00', 'ram|mung-1');
  const today = onDate('2026-09-15', 9).jd;
  assert.deepEqual(nextLunarOff(hours, today), { jd: jdFromDate(25, 9, 2026), kind: 'ram' });
  assert.equal(nextLunarOff(h('06:00-10:00', 'T2'), today), null);
});

test('parts of the day', () => {
  assert.equal(currentBuoi(7 * 60), 'sang');
  assert.equal(currentBuoi(12 * 60), 'trua');
  assert.equal(currentBuoi(19 * 60 + 30), 'toi');
  assert.equal(currentBuoi(23 * 60), 'khuya');
  assert.equal(currentBuoi(2 * 60), 'khuya');
  assert.equal(openDuring(h('06:00-08:00'), 'sang'), true);
  assert.equal(openDuring(h('06:00-08:00'), 'toi'), false);
  assert.equal(openDuring(h('18:00-23:00'), 'khuya'), true);
  assert.equal(openDuring(h('00:00-01:00'), 'khuya'), true);
});

test('vnNow uses Vietnam time regardless of device timezone', () => {
  // 2026-09-13T12:30:00Z is Sunday 19:30 in Vietnam (UTC+7).
  assert.deepEqual(vnNow(new Date('2026-09-13T12:30:00Z')), { day: 0, minutes: 19 * 60 + 30, jd: jdFromDate(13, 9, 2026) });
  // 2026-09-13T20:00:00Z is already Monday 03:00, 14 September, in Vietnam.
  assert.deepEqual(vnNow(new Date('2026-09-13T20:00:00Z')), { day: 1, minutes: 180, jd: jdFromDate(14, 9, 2026) });
});
