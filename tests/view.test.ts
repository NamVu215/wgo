import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceKm, formatDistance } from '../src/lib/view.ts';

test('distance between two places in Huế', () => {
  // One degree of latitude is about 111.2 km.
  const km = distanceKm({ lat: 16, lng: 107.59 }, { lat: 17, lng: 107.59 });
  assert.ok(Math.abs(km - 111.2) < 0.2, String(km));
  // Cầu Trường Tiền → Chùa Thiên Mụ: 1.6 km north–south and 4.8 km east–west ≈ 5.1 km.
  const hue = distanceKm({ lat: 16.4677, lng: 107.5906 }, { lat: 16.4531, lng: 107.5452 });
  assert.ok(hue > 5 && hue < 5.2, String(hue));
  assert.equal(distanceKm({ lat: 16.46, lng: 107.59 }, { lat: 16.46, lng: 107.59 }), 0);
});

test('distance text', () => {
  assert.equal(formatDistance(0.01), '50 m');
  assert.equal(formatDistance(0.349), '350 m');
  assert.equal(formatDistance(1.24), '1,2 km');
  assert.equal(formatDistance(12.6), '13 km');
});
