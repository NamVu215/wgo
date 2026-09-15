import 'maplibre-gl/dist/maplibre-gl.css';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import maplibrePkg from 'maplibre-gl/package.json';
import { getStatus, vnNow } from '../lib/hours.ts';
import { mapStyle } from '../lib/map-style.ts';
import { formatPrice } from '../lib/text.ts';
import { directionsUrl, distanceKm, formatDistance, placeSubtitle, placeUrl, ratingText, type ClientPlace } from '../lib/view.ts';
import { bindSaveButton, readData, readJson, setTone, shortStatus, toast } from './common.ts';
import { lastPosition, locate, locateIfAllowed, type Position } from './location.ts';

type Bounds = [number, number, number, number];

const data = readData();
const city = readJson<{ id: string; bounds: Bounds }>('wgo-city');
const kindIcons = readJson<Record<string, string>>('wgo-kind-icons');
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const params = new URLSearchParams(location.search);
let onlyOpen = params.get('mo') === '1';
let kind = params.get('loai') ?? '';
let selected: string | null = params.get('id');
let position: Position | null = lastPosition();

// ---- Card & filters (work even before the map library loads) ----
const syncSave = bindSaveButton($('mc-save'));

const visible = (p: ClientPlace, now = vnNow()) =>
  (!kind || p.loai === kind) && (!onlyOpen || getStatus(p.hours, now).kind === 'open');

function renderCard() {
  const p = data.places.find((x) => x.id === selected);
  $('map-card').hidden = !p;
  document.body.classList.toggle('map-has-card', Boolean(p));
  if (!p) return;
  const now = vnNow();
  const url = placeUrl(p);
  $<HTMLAnchorElement>('mc-name').textContent = p.ten;
  $<HTMLAnchorElement>('mc-name').href = url;
  $<HTMLAnchorElement>('mc-view').href = url;
  $<HTMLAnchorElement>('mc-go').href = directionsUrl(p);
  $('mc-rate').textContent = ratingText(p.wgoCham);
  $('mc-sub').textContent = placeSubtitle(p, data.dishes, data.kinds);
  const status = shortStatus(getStatus(p.hours, now), now);
  $('mc-status').textContent = status.text;
  setTone($('mc-status'), status.tone);
  $('mc-dist').textContent = position ? formatDistance(distanceKm(position, p)) : '';
  $('mc-extra').textContent = [formatPrice(p.giaTu, p.giaDen), p.khuVuc].filter(Boolean).join(' · ');
  $('mc-save').dataset.save = p.id;
  syncSave();
}

function writeUrl() {
  const u = new URLSearchParams();
  if (selected) u.set('id', selected);
  if (onlyOpen) u.set('mo', '1');
  if (kind) u.set('loai', kind);
  const qs = u.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

function renderFilters() {
  $('map-open').setAttribute('aria-pressed', String(onlyOpen));
  document.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.kind === kind));
  });
}

// ---- Map ----
let map: MapLibreMap | null = null;
const markers = new Map<string, { marker: Marker; el: HTMLButtonElement }>();
let me: Marker | null = null;

const iconSvg = (name: string) => document.querySelector(`template[data-icon="${name}"]`)?.innerHTML ?? '';

function paintMarkers() {
  if (!map) return;
  const now = vnNow();
  for (const p of data.places) {
    const entry = markers.get(p.id);
    if (!entry) continue;
    const show = visible(p, now) || p.id === selected;
    if (!show) {
      entry.marker.remove();
      continue;
    }
    const { tone } = shortStatus(getStatus(p.hours, now), now);
    const pin = entry.el.firstElementChild as HTMLElement;
    pin.className = `pin pin--${tone}${p.id === selected ? ' pin--active' : ''}`;
    entry.el.style.zIndex = p.id === selected ? '3' : tone === 'open' ? '2' : '1';
    entry.el.setAttribute('aria-pressed', String(p.id === selected));
    entry.marker.addTo(map);
  }
}

// Space at the bottom of the screen covered by the place card and navigation.
const CARD_SPACE = 300;

function select(id: string | null) {
  selected = id;
  paintMarkers();
  renderCard();
  writeUrl();
  const p = data.places.find((x) => x.id === id);
  if (!p || !map) return;
  // Keep the chosen pin above the card.
  const { y } = map.project([p.lng, p.lat]);
  const limit = map.getContainer().clientHeight - CARD_SPACE;
  if (y > limit) map.panBy([0, y - limit + 40]);
}

function applyFilters() {
  renderFilters();
  if (selected) {
    const p = data.places.find((x) => x.id === selected);
    if (p && !visible(p)) selected = null;
  }
  paintMarkers();
  renderCard();
  writeUrl();
  const count = data.places.filter((p) => visible(p)).length;
  toast(count ? `${count} chỗ` : 'Không có chỗ nào khớp');
}

$('map-open').addEventListener('click', () => {
  onlyOpen = !onlyOpen;
  applyFilters();
});
document.querySelectorAll<HTMLButtonElement>('[data-kind]').forEach((b) => {
  b.addEventListener('click', () => {
    kind = kind === b.dataset.kind ? '' : (b.dataset.kind ?? '');
    applyFilters();
  });
});

function drawPosition(p: Position) {
  if (!map) return;
  if (!me) {
    const el = document.createElement('div');
    el.className = 'me-dot';
    el.setAttribute('aria-hidden', 'true');
    me = new maplibre!.Marker({ element: el });
  }
  me.setLngLat([p.lng, p.lat]).addTo(map);
}

const [west, south, east, north] = city.bounds;
const cityCenter = { lat: (south + north) / 2, lng: (west + east) / 2 };

$('map-locate').addEventListener('click', async () => {
  const btn = $<HTMLButtonElement>('map-locate');
  btn.disabled = true;
  try {
    position = await locate();
    drawPosition(position);
    renderCard();
    const inside = position.lng >= west && position.lng <= east && position.lat >= south && position.lat <= north;
    if (inside) map?.easeTo({ center: [position.lng, position.lat], zoom: 16 });
    else toast(`Bạn đang ở ngoài bản đồ, cách khoảng ${formatDistance(distanceKm(position, cityCenter))}`);
  } catch (err) {
    toast((err as Error).message);
  } finally {
    btn.disabled = false;
  }
});

const isDark = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
};

let maplibre: typeof import('maplibre-gl') | null = null;

async function start() {
  try {
    // Served from public/vendor (see integrations/maplibre.ts) so its worker file sits next to it.
    const url = `/vendor/maplibre-gl-${maplibrePkg.version}/maplibre-gl.mjs`;
    maplibre = (await import(/* @vite-ignore */ url)) as typeof import('maplibre-gl');
  } catch (err) {
    console.error(err);
    $('map-loading').textContent = 'Không tải được bản đồ. Kiểm tra mạng rồi mở lại trang.';
    return;
  }

  const pad = 0.04;
  const focus = data.places.find((p) => p.id === selected);
  try {
    map = new maplibre.Map({
      container: 'map',
      style: mapStyle(city.id, city.bounds, isDark()),
      bounds: focus ? undefined : [west, south, east, north],
      center: focus ? [focus.lng, focus.lat] : undefined,
      zoom: focus ? 16.5 : undefined,
      minZoom: 10.5,
      maxZoom: 19,
      attributionControl: { compact: false },
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
  } catch (err) {
    console.error(err);
    $('map-loading').textContent = 'Máy này không hiển thị được bản đồ. Xem danh sách ở Khám phá.';
    return;
  }
  map.touchZoomRotate.disableRotation();
  if (focus) map.panBy([0, CARD_SPACE / 2 - 60], { animate: false });
  $('map-loading').hidden = true;

  if (!focus && data.places.length) {
    const lats = data.places.map((p) => p.lat);
    const lngs = data.places.map((p) => p.lng);
    map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], {
      padding: { top: 100, bottom: 140, left: 44, right: 44 },
      maxZoom: 16,
      animate: false,
    });
  }
  // Limit panning to the downloaded area, widened to the first view so it never cuts off pins.
  const view = map.getBounds();
  map.setMaxBounds([
    [Math.min(west - pad, view.getWest()), Math.min(south - pad, view.getSouth())],
    [Math.max(east + pad, view.getEast()), Math.max(north + pad, view.getNorth())],
  ]);

  for (const p of data.places) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'pin-btn';
    el.setAttribute('aria-label', p.ten);
    el.innerHTML = `<span class="pin">${iconSvg(kindIcons[p.loai] ?? 'pin')}</span>`;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      select(p.id);
    });
    markers.set(p.id, { el, marker: new maplibre.Marker({ element: el }).setLngLat([p.lng, p.lat]) });
  }
  map.on('click', () => select(null));

  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => map?.setStyle(mapStyle(city.id, city.bounds, isDark())));

  paintMarkers();
  if (position) drawPosition(position);
}

renderFilters();
renderCard();
start();
locateIfAllowed().then((p) => {
  if (!p) return;
  position = p;
  drawPosition(p);
  renderCard();
});
setInterval(paintMarkers, 60_000);
