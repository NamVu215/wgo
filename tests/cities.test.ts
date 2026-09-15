import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkCities, citiesWithPlaces, cityHref } from '../src/lib/cities.ts';
import { parsePlaces, parseRefs, type Issue, type Place } from '../src/lib/data.ts';
import { placeUrl } from '../src/lib/view.ts';

const CITIES = [
  { id: 'hue', name: 'Huế', bounds: [107.48, 16.35, 107.7, 16.56] as [number, number, number, number] },
  { id: 'vung-tau', name: 'Vũng Tàu', bounds: [107.04, 10.31, 107.28, 10.47] as [number, number, number, number] },
];
const place = (over: Partial<Place>) => ({ id: 'a', dong: 2, thanhPho: 'hue', lat: 16.46, lng: 107.59, ...over }) as Place;

test('places of unknown cities are dropped with an error', () => {
  const issues: Issue[] = [];
  const kept = checkCities([place({ id: 'a' }), place({ id: 'b', thanhPho: 'da-nang', dong: 3 })], issues, CITIES);
  assert.deepEqual(kept.map((p) => p.id), ['a']);
  assert.equal(issues.length, 1);
  assert.equal(issues[0].muc, 'loi');
  assert.match(issues[0].noiDung, /da-nang/);
});

test('coordinates in the wrong city only warn', () => {
  const issues: Issue[] = [];
  // A Huế place typed with Vũng Tàu coordinates.
  const kept = checkCities([place({ lat: 10.34, lng: 107.08 })], issues, CITIES);
  assert.equal(kept.length, 1);
  assert.equal(issues[0].muc, 'canh-bao');
  assert.match(issues[0].noiDung, /ngoài Huế/);
});

test('cities with places, links', () => {
  assert.deepEqual(citiesWithPlaces([{ thanhPho: 'vung-tau' }], CITIES).map((c) => c.id), ['vung-tau']);
  assert.equal(cityHref('vung-tau'), '/vung-tau/');
  assert.equal(cityHref('hue', 'ban-do'), '/hue/ban-do/');
  assert.equal(placeUrl({ id: 'banh-khot-goc-vu-sua', thanhPho: 'vung-tau' }), '/vung-tau/banh-khot-goc-vu-sua/');
});

test('place ids cannot take the name of a city page', () => {
  const refs = parseRefs('id,ten\nbun-bo,Bún bò', 'id,ten\nquan-an,Quán ăn', 'id,ten');
  const csv = 'id,trang_thai,ten,thanh_pho,loai,dia_chi,vi_do,kinh_do,gio_mo_cua\nkham-pha,hien,Quán A,hue,quan-an,1 Lê Lợi,16.46,107.59,06:00-10:00';
  const { places, issues } = parsePlaces(csv, refs);
  assert.equal(places.length, 0);
  assert.match(issues[0].noiDung, /trùng tên một trang/);
});
