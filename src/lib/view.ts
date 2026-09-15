// Shared by pages (build time) and browser scripts. No Node-only imports here.
import type { Hours } from './hours.ts';
import type { Place } from './data.ts';

export type ClientPlace = {
  id: string;
  thanhPho: string;
  ten: string;
  loai: string;
  mon: string[];
  monNenGoi: string;
  khuVuc: string;
  hours: Hours;
  giaTu: number | null;
  giaDen: number | null;
  wgoCham: number | null;
  noiBat: boolean;
  tags: string[];
  lat: number;
  lng: number;
  anh: string | null;
};

export type Label = { id: string; ten: string };
export type ClientData = { places: ClientPlace[]; dishes: Label[]; kinds: Label[] };

export function toClientPlace(p: Place): ClientPlace {
  return {
    id: p.id, thanhPho: p.thanhPho, ten: p.ten, loai: p.loai, mon: p.mon, monNenGoi: p.monNenGoi, khuVuc: p.khuVuc,
    hours: p.hours, giaTu: p.giaTu, giaDen: p.giaDen, wgoCham: p.wgoCham, noiBat: p.noiBat,
    tags: p.tags, lat: p.lat, lng: p.lng, anh: p.anh[0] ?? null,
  };
}

// Safe to drop inside <script type="application/json">.
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export const placeUrl = (p: { id: string; thanhPho: string }) => `/${p.thanhPho}/${p.id}/`;
export const directionsUrl = (p: { lat: number; lng: number }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;

const DISH_ICONS: Record<string, string> = {
  'bun-bo': 'bowl', 'bun-hen': 'bowl', 'banh-canh-nam-pho': 'bowl',
  'com-hen': 'rice',
  'banh-beo': 'cakes', 'banh-nam': 'cakes', 'banh-loc': 'cakes', 'banh-uot': 'cakes',
  'banh-khoai': 'pancake', 'banh-xeo': 'pancake',
  'nem-lui': 'skewer', 'bun-thit-nuong': 'skewer',
  che: 'glass', 'ca-phe': 'coffee',
  'banh-khot': 'pancake', 'mi-thay': 'bowl', 'hu-tieu-muc': 'bowl', 'banh-canh-ghe': 'bowl',
  'lau-ca-duoi': 'fish', 'hai-san': 'fish', 'bong-lan-trung-muoi': 'cakes',
  'com-tam': 'rice', pho: 'bowl', 'banh-mi': 'bread', 'hu-tieu': 'bowl', oc: 'fish', 'bot-chien': 'pancake',
  'banh-canh-cua': 'bowl', 'lau-bo': 'bowl',
};
export const dishIcon = (id: string) => DISH_ICONS[id] ?? 'bowl';

const KIND_ICONS: Record<string, string> = {
  'quan-an': 'bowl', 'quan-nuoc': 'glass', cafe: 'coffee', 'an-vat': 'skewer', 'check-in': 'camera', bar: 'glass',
};
export const kindIcon = (id: string) => KIND_ICONS[id] ?? 'pin';

// One line under a place name: what to eat there.
export function placeSubtitle(p: Pick<ClientPlace, 'mon' | 'loai'>, dishes: Label[], kinds: Label[], max = 3): string {
  const names = p.mon.map((id) => dishes.find((d) => d.id === id)?.ten ?? id);
  if (names.length === 0) return kinds.find((k) => k.id === p.loai)?.ten ?? '';
  const shown = names.slice(0, max).join(' · ');
  return names.length > max ? `${shown} +${names.length - max}` : shown;
}

export const ratingText = (r: number | null) => (r === null ? '' : `${String(r).replace('.', ',')}★`);

// Home page "mood" chips.
export type Mood = { id: string; label: string; word: string };
export const MOODS: Mood[] = [
  { id: 'an-no', label: 'Ăn no', word: 'ăn gì' },
  { id: 'an-vat', label: 'Ăn vặt', word: 'ăn vặt gì' },
  { id: 'nuoc', label: 'Chè & nước', word: 'uống gì' },
  { id: 'cafe', label: 'Cafe', word: 'cafe đâu' },
  { id: 'check-in', label: 'Check-in', word: 'đi đâu' },
];

export function matchesMood(p: Pick<ClientPlace, 'loai' | 'tags'>, mood: string): boolean {
  switch (mood) {
    case 'an-no': return p.loai === 'quan-an' && !p.tags.includes('an-vat');
    case 'an-vat': return p.loai === 'an-vat' || p.tags.includes('an-vat');
    case 'nuoc': return p.loai === 'quan-nuoc';
    case 'cafe': return p.loai === 'cafe';
    case 'check-in': return p.loai === 'check-in';
    default: return true;
  }
}

export type PriceBucket = { id: string; label: string; from: number; to: number };
export const PRICE_BUCKETS: PriceBucket[] = [
  { id: 'duoi-30', label: '< 30k', from: 0, to: 29_999 },
  { id: '30-60', label: '30–60k', from: 30_000, to: 60_000 },
  { id: '60-100', label: '60–100k', from: 60_001, to: 100_000 },
  { id: 'tren-100', label: '> 100k', from: 100_001, to: Number.POSITIVE_INFINITY },
];

export function inPriceBucket(p: Pick<ClientPlace, 'giaTu' | 'giaDen'>, bucket: PriceBucket): boolean {
  const lo = p.giaTu ?? p.giaDen;
  const hi = p.giaDen ?? p.giaTu;
  if (lo === null || hi === null) return false;
  return lo <= bucket.to && bucket.from <= hi;
}

// ---- Distance ----
export type LatLng = { lat: number; lng: number };

// Great-circle distance in kilometres.
export function distanceKm(a: LatLng, b: LatLng): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.min(1, Math.sqrt(s)));
}

// "350 m", "1,2 km", "12 km"
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  if (km < 10) return `${km.toFixed(1).replace('.', ',')} km`;
  return `${Math.round(km)} km`;
}

// "Gần đây có gì?": other places within `radiusKm`, places of a different kind first
// (after a meal: cafe, chè, check-in), then nearest.
export function nearbyPlaces<T extends LatLng & { id: string; loai: string }>(
  place: T, all: T[], radiusKm = 1, max = 4,
): { place: T; km: number }[] {
  return all
    .filter((p) => p.id !== place.id)
    .map((p) => ({ place: p, km: distanceKm(place, p) }))
    .filter((x) => x.km <= radiusKm)
    .sort((a, b) => Number(a.place.loai === place.loai) - Number(b.place.loai === place.loai) || a.km - b.km)
    .slice(0, max);
}
