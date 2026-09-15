import { csvToRecords } from './csv.ts';
import { parseHours, type Hours } from './hours.ts';
import { MAX_PHOTOS, photoSource } from './photos.ts';
import { parseDecimal, parseMoney, splitList } from './text.ts';

export type Dish = { id: string; ten: string; nhom: string; icon: string };
export type Kind = { id: string; ten: string };
export type Tag = { id: string; ten: string };

export type Place = {
  id: string;
  dong: number; // row in the sheet, for error messages
  noiBat: boolean;
  ten: string;
  thanhPho: string;
  khuVuc: string;
  loai: string;
  mon: string[];
  monNenGoi: string;
  diaChi: string;
  lat: number;
  lng: number;
  linkGoogleMaps: string;
  hours: Hours;
  giaTu: number | null;
  giaDen: number | null;
  wgoCham: number | null;
  nhanXet: string;
  meo: string;
  tags: string[];
  dienThoai: string;
  facebook: string;
  tiktok: string;
  // Download links while parsing; photo ids once load.ts has processed them.
  anh: string[];
  // roi = WGo đã đi thử · online = đã đối chiếu nhiều nguồn trên mạng · chua = chưa kiểm chứng
  kiemChung: 'roi' | 'online' | 'chua';
  nguon: string;
  capNhat: string;
};

export type Issue = { dong: number; id: string; muc: 'loi' | 'canh-bao'; noiDung: string };

export type Refs = { dishes: Dish[]; kinds: Kind[]; tags: Tag[] };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Rough bounding box of Vietnam, catches swapped or mistyped coordinates.
const VN_BOUNDS = { latMin: 8, latMax: 23.5, lngMin: 102, lngMax: 110 };

function safeUrl(raw: string): string | null {
  if (!raw) return '';
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null;
  } catch {
    return null;
  }
}

export function parseRefs(monCsv: string, loaiCsv: string, tagsCsv: string): Refs {
  const dishes = csvToRecords(monCsv)
    .filter((r) => r.id)
    .map((r) => ({ id: r.id, ten: r.ten || r.id, nhom: r.nhom ?? '', icon: r.id }));
  const kinds = csvToRecords(loaiCsv).filter((r) => r.id).map((r) => ({ id: r.id, ten: r.ten || r.id }));
  const tags = csvToRecords(tagsCsv).filter((r) => r.id).map((r) => ({ id: r.id, ten: r.ten || r.id }));
  return { dishes, kinds, tags };
}

// Validates every row. Rows with an error ("loi") are left out; warnings ("canh-bao") keep the row.
export function parsePlaces(csv: string, refs: Refs): { places: Place[]; issues: Issue[] } {
  const issues: Issue[] = [];
  const places: Place[] = [];
  const seen = new Set<string>();
  const dishIds = new Set(refs.dishes.map((d) => d.id));
  const kindIds = new Set(refs.kinds.map((k) => k.id));
  const tagIds = new Set(refs.tags.map((t) => t.id));

  csvToRecords(csv).forEach((r, index) => {
    const dong = index + 2; // +1 header, +1 because sheets count from 1
    const id = r.id ?? '';
    const errors: string[] = [];
    const warn = (noiDung: string) => issues.push({ dong, id, muc: 'canh-bao', noiDung });

    const trangThai = (r.trang_thai ?? '').toLowerCase();
    if (trangThai === 'an') return;
    if (trangThai !== 'hien') errors.push(`trang_thai phải là "hien" hoặc "an" (đang là "${r.trang_thai ?? ''}")`);

    if (!id) errors.push('thiếu id');
    else if (!SLUG_RE.test(id)) errors.push(`id "${id}" chỉ được dùng chữ thường không dấu, số và dấu -`);
    else if (seen.has(id)) errors.push(`id "${id}" bị trùng`);
    seen.add(id);

    if (!r.ten) errors.push('thiếu tên');
    if (!r.thanh_pho) errors.push('thiếu thanh_pho');
    if (!r.dia_chi) errors.push('thiếu địa chỉ');
    if (!r.loai) errors.push('thiếu loai');
    else if (!kindIds.has(r.loai)) errors.push(`loai "${r.loai}" không có trong tab loai`);

    const lat = parseDecimal(r.vi_do ?? '');
    const lng = parseDecimal(r.kinh_do ?? '');
    if (lat === null || lng === null) errors.push('thiếu hoặc sai tọa độ (vi_do, kinh_do)');
    else if (lat < VN_BOUNDS.latMin || lat > VN_BOUNDS.latMax || lng < VN_BOUNDS.lngMin || lng > VN_BOUNDS.lngMax) {
      errors.push(`tọa độ ${lat}, ${lng} nằm ngoài Việt Nam (có thể bị đảo vi_do/kinh_do)`);
    }

    const { hours, errors: hourErrors } = parseHours(r.gio_mo_cua ?? '', r.ngay_nghi ?? '');
    hourErrors.forEach(warn);
    if (!r.gio_mo_cua) warn('chưa có giờ mở cửa');

    const mon = splitList(r.mon ?? '');
    mon.filter((m) => !dishIds.has(m)).forEach((m) => warn(`món "${m}" không có trong tab mon`));
    const tags = splitList(r.tags ?? '');
    tags.filter((t) => !tagIds.has(t)).forEach((t) => warn(`tag "${t}" không có trong tab tags`));

    const giaTu = parseMoney(r.gia_tu ?? '');
    const giaDen = parseMoney(r.gia_den ?? '');
    if (r.gia_tu && giaTu === null) warn(`gia_tu "${r.gia_tu}" không phải số`);
    if (r.gia_den && giaDen === null) warn(`gia_den "${r.gia_den}" không phải số`);
    if (giaTu !== null && giaDen !== null && giaTu > giaDen) warn('gia_tu lớn hơn gia_den');

    let wgoCham = parseDecimal(r.wgo_cham ?? '');
    if (wgoCham !== null && (wgoCham < 1 || wgoCham > 5)) {
      warn(`wgo_cham "${r.wgo_cham}" phải từ 1 đến 5`);
      wgoCham = null;
    }

    const links: Record<'link_google_maps' | 'facebook' | 'tiktok', string> = {
      link_google_maps: '',
      facebook: '',
      tiktok: '',
    };
    for (const key of Object.keys(links) as (keyof typeof links)[]) {
      const url = safeUrl(r[key] ?? '');
      if (url === null) warn(`${key} không phải link hợp lệ`);
      else links[key] = url;
    }

    const anh: string[] = [];
    for (const raw of splitList(r.anh ?? '')) {
      const source = photoSource(raw);
      if ('error' in source) warn(source.error);
      else anh.push(source.download);
    }
    if (anh.length > MAX_PHOTOS) warn(`chỉ dùng ${MAX_PHOTOS} ảnh đầu tiên`);

    const kiemChungRaw = (r.kiem_chung ?? '').trim().toLowerCase();
    const kiemChung = kiemChungRaw === 'roi' || kiemChungRaw === 'online' ? kiemChungRaw : 'chua';
    if (kiemChungRaw && kiemChungRaw !== kiemChung) warn(`kiem_chung "${r.kiem_chung}" phải là roi, online hoặc chua`);

    const capNhat = normalizeDate(r.cap_nhat ?? '');
    if (r.cap_nhat && !capNhat) warn('cap_nhat nên ghi dạng 2026-09-13 hoặc 13/09/2026');

    if (errors.length > 0) {
      errors.forEach((noiDung) => issues.push({ dong, id, muc: 'loi', noiDung }));
      return;
    }

    places.push({
      id,
      dong,
      noiBat: (r.noi_bat ?? '').toLowerCase() === 'co',
      ten: r.ten,
      thanhPho: r.thanh_pho,
      khuVuc: r.khu_vuc ?? '',
      loai: r.loai,
      mon: mon.filter((m) => dishIds.has(m)),
      monNenGoi: r.mon_nen_goi ?? '',
      diaChi: r.dia_chi,
      lat: lat as number,
      lng: lng as number,
      linkGoogleMaps: links.link_google_maps,
      hours,
      giaTu,
      giaDen,
      wgoCham,
      nhanXet: r.nhan_xet ?? '',
      meo: r.meo ?? '',
      tags: tags.filter((t) => tagIds.has(t)),
      dienThoai: (r.dien_thoai ?? '').replace(/[^\d+]/g, ''),
      facebook: links.facebook,
      tiktok: links.tiktok,
      anh: anh.slice(0, MAX_PHOTOS),
      kiemChung,
      nguon: r.nguon ?? '',
      capNhat: capNhat ?? '',
    });
  });

  return { places, issues };
}

// "2026-09-13" or "13/09/2026" → "2026-09-13"; null when unreadable.
export function normalizeDate(raw: string): string | null {
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
}

export function directionsUrl(p: Pick<Place, 'lat' | 'lng'>): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
}
