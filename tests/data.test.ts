import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv } from '../src/lib/csv.ts';
import { parsePlaces, parseRefs } from '../src/lib/data.ts';
import { formatPrice, normalize, parseDecimal, parseMoney } from '../src/lib/text.ts';

const refs = parseRefs(
  'id,ten\nbun-bo,Bún bò\nche,Chè',
  'id,ten\nquan-an,Quán ăn\ncafe,Cafe',
  'id,ten\nlocal,Local',
);
const HEADER = 'id,trang_thai,noi_bat,ten,thanh_pho,khu_vuc,loai,mon,dia_chi,vi_do,kinh_do,gio_mo_cua,ngay_nghi,gia_tu,gia_den,wgo_cham,tags,facebook,kiem_chung';
const row = (over: Record<string, string> = {}) => {
  const base: Record<string, string> = {
    id: 'bun-bo-a', trang_thai: 'hien', noi_bat: 'co', ten: 'Bún bò A', thanh_pho: 'hue', khu_vuc: 'Gia Hội',
    loai: 'quan-an', mon: 'bun-bo', dia_chi: '"1 Lê Lợi, Huế"', vi_do: '16.46', kinh_do: '107.59',
    gio_mo_cua: '06:00-10:00', ngay_nghi: '', gia_tu: '30000', gia_den: '50000', wgo_cham: '4.5',
    tags: 'local', facebook: '', kiem_chung: 'roi', ...over,
  };
  return HEADER.split(',').map((k) => base[k]).join(',');
};
const parse = (...rows: string[]) => parsePlaces([HEADER, ...rows].join('\n'), refs);

test('CSV: quotes, escaped quotes, commas, CRLF, BOM', () => {
  assert.deepEqual(parseCsv('﻿a,b\r\n"x, y","say ""hi"""\r\n'), [['a', 'b'], ['x, y', 'say "hi"']]);
  assert.deepEqual(parseCsv('a\n\n\nb'), [['a'], ['b']]);
});

test('valid row becomes a place', () => {
  const { places, issues } = parse(row());
  assert.deepEqual(issues, []);
  assert.equal(places[0].diaChi, '1 Lê Lợi, Huế');
  assert.equal(places[0].noiBat, true);
  assert.equal(places[0].wgoCham, 4.5);
  assert.equal(places[0].kiemChung, true);
});

test('rows with errors are skipped and reported with the sheet row number', () => {
  const { places, issues } = parse(
    row(),
    row({ id: 'Bun Bo', vi_do: '107.59', kinh_do: '16.46' }),
    row({ id: 'bun-bo-a' }),
    row({ id: 'x', loai: 'nha-hang' }),
  );
  assert.equal(places.length, 1);
  const errors = issues.filter((i) => i.muc === 'loi');
  assert.ok(errors.some((i) => i.dong === 3 && i.noiDung.includes('chữ thường')));
  assert.ok(errors.some((i) => i.dong === 3 && i.noiDung.includes('ngoài Việt Nam')));
  assert.ok(errors.some((i) => i.dong === 4 && i.noiDung.includes('trùng')));
  assert.ok(errors.some((i) => i.dong === 5 && i.noiDung.includes('nha-hang')));
});

test('hidden rows are ignored silently', () => {
  const { places, issues } = parse(row({ trang_thai: 'an', id: '' }));
  assert.equal(places.length, 0);
  assert.deepEqual(issues, []);
});

test('warnings keep the row but drop bad values', () => {
  const { places, issues } = parse(row({ mon: 'bun-bo|pho', wgo_cham: '9', facebook: 'javascript:alert(1)', gio_mo_cua: '6h-10h' }));
  assert.equal(places.length, 1);
  assert.deepEqual(places[0].mon, ['bun-bo']);
  assert.equal(places[0].wgoCham, null);
  assert.equal(places[0].facebook, '');
  assert.equal(issues.filter((i) => i.muc === 'canh-bao').length, 4);
});

test('Vietnamese-locale numbers from Google Sheets', () => {
  const { places } = parse(row({ vi_do: '"16,4879"', kinh_do: '"107,58"', gia_tu: '"30.000"', gia_den: '45k', wgo_cham: '"4,5"' }));
  assert.equal(places[0].lat, 16.4879);
  assert.equal(places[0].giaTu, 30000);
  assert.equal(places[0].giaDen, 45000);
  assert.equal(places[0].wgoCham, 4.5);
});

test('text helpers', () => {
  assert.equal(normalize('Bún Bò Mệ Kéo – Đông Ba'), 'bun bo me keo – dong ba');
  assert.equal(formatPrice(30000, 45000), '30–45k');
  assert.equal(formatPrice(200000, 200000), '200k');
  assert.equal(formatPrice(0, 0), 'Miễn phí');
  assert.equal(formatPrice(null, null), '');
  assert.equal(formatPrice(2500, 10000), '2,5–10k');
  assert.equal(parseDecimal('abc'), null);
  assert.equal(parseMoney('ba chục'), null);
});

test('sample data in data/hue has no errors', () => {
  const read = (f: string) => readFileSync(new URL(`../data/hue/${f}.csv`, import.meta.url), 'utf8');
  const sampleRefs = parseRefs(read('mon'), read('loai'), read('tags'));
  const { places, issues } = parsePlaces(read('dia-diem'), sampleRefs);
  assert.deepEqual(issues.filter((i) => i.muc === 'loi'), []);
  assert.equal(places.length, 22);
});
