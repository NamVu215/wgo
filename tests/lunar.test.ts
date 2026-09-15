import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jdFromDate, jdToDate, lunarFromDate } from '../src/lib/lunar.ts';

// Well-known dates: Tết, Trung thu, rằm tháng Giêng and leap months.
const KNOWN: [string, number, number, boolean][] = [
  ['2024-02-10', 1, 1, false],
  ['2025-01-29', 1, 1, false],
  ['2026-02-17', 1, 1, false],
  ['2027-02-06', 1, 1, false],
  ['2023-02-05', 15, 1, false],
  ['2024-09-17', 15, 8, false],
  ['2025-10-06', 15, 8, false],
  ['2026-09-25', 15, 8, false],
  ['2023-03-22', 1, 2, true],
  ['2025-06-25', 1, 6, false],
  ['2025-07-25', 1, 6, true],
];

test('solar → lunar on known dates', () => {
  for (const [iso, day, month, leap] of KNOWN) {
    const [y, m, d] = iso.split('-').map(Number);
    const l = lunarFromDate(d, m, y);
    assert.deepEqual([l.day, l.month, l.leap], [day, month, leap], iso);
  }
});

test('Julian day number round trip', () => {
  for (const [d, m, y] of [[1, 1, 2000], [29, 2, 2024], [31, 12, 2026]]) {
    assert.deepEqual(jdToDate(jdFromDate(d, m, y)), { d, m, y });
  }
  assert.equal(jdFromDate(2, 1, 2000) - jdFromDate(1, 1, 2000), 1);
});
