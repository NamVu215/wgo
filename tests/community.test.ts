import { test } from 'node:test';
import assert from 'node:assert/strict';
import { averageText, formLink, parseReviews, summarize } from '../src/lib/reviews.ts';
import { nearbyPlaces } from '../src/lib/view.ts';

const HEADER = 'ma,quan,sao,nhan_xet,ten,ngay';
const ids = new Set(['bun-bo-a', 'che-b']);

test('approved reviews are read and bad rows are reported', () => {
  const csv = [
    HEADER,
    'r1,bun-bo-a,5,"Nước dùng đậm, <b>ngon</b>",Lan,2026-09-14',
    'r2,bun-bo-a,4,,,15/09/2026',
    'r3,khong-co,5,Hay,,2026-09-14',
    'r4,che-b,6,Quá ngon,,2026-09-14',
    'r1,che-b,3,Trùng mã,,2026-09-14',
    ',,,,,',
  ].join('\n');
  const { reviews, issues } = parseReviews(csv, ids);
  assert.equal(reviews.length, 2);
  assert.equal(reviews[0].nhanXet, 'Nước dùng đậm, <b>ngon</b>'); // escaped when rendered
  assert.equal(reviews[1].ngay, '2026-09-15');
  assert.equal(issues.length, 3);
});

test('summary: average, count and newest reviews with text first', () => {
  const { reviews } = parseReviews([
    HEADER,
    'a,bun-bo-a,5,Ngon,Lan,2026-09-10',
    'b,bun-bo-a,4,,,2026-09-12',
    'c,bun-bo-a,4,Được,,2026-09-14',
    'd,che-b,2,Ngọt quá,,2026-09-14',
  ].join('\n'), ids);
  const s = summarize(reviews, 'bun-bo-a');
  assert.equal(s.count, 3);
  assert.equal(averageText(s.average!), '4,3');
  assert.deepEqual(s.latest.map((r) => r.ma), ['c', 'a']);
  assert.deepEqual(summarize(reviews, 'khong-co'), { count: 0, average: null, latest: [] });
});

test('prefilled form links', () => {
  const t = 'https://docs.google.com/forms/d/e/X/viewform?usp=pp_url&entry.1=__MA__&entry.2=__TEN__';
  assert.equal(formLink(t, { id: 'bun-bo-a', ten: 'Bún bò Mệ Kéo & co' }),
    'https://docs.google.com/forms/d/e/X/viewform?usp=pp_url&entry.1=bun-bo-a&entry.2=B%C3%BAn%20b%C3%B2%20M%E1%BB%87%20K%C3%A9o%20%26%20co');
  assert.equal(formLink(t), 'https://docs.google.com/forms/d/e/X/viewform?usp=pp_url&entry.1=&entry.2=');
  assert.equal(formLink(''), '');
});

test('nearby places: within 1 km, other kinds first, then nearest', () => {
  const base = { id: 'a', loai: 'quan-an', lat: 16.46, lng: 107.59 };
  const all = [
    base,
    { id: 'an-gan', loai: 'quan-an', lat: 16.461, lng: 107.59 }, // ~110 m, same kind
    { id: 'cafe-xa', loai: 'cafe', lat: 16.467, lng: 107.59 }, // ~780 m
    { id: 'che-gan', loai: 'quan-nuoc', lat: 16.4625, lng: 107.59 }, // ~280 m
    { id: 'qua-xa', loai: 'cafe', lat: 16.48, lng: 107.59 }, // ~2.2 km
  ];
  assert.deepEqual(nearbyPlaces(base, all).map((x) => x.place.id), ['che-gan', 'cafe-xa', 'an-gan']);
});
