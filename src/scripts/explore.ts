import { BUOI, getStatus, openDuring, vnNow, type Buoi } from '../lib/hours.ts';
import { distanceKm, inPriceBucket, PRICE_BUCKETS, type ClientPlace } from '../lib/view.ts';
import { normalize } from '../lib/text.ts';
import { paintDistances, paintStatuses, ratingValue, readData, toast } from './common.ts';
import { lastPosition, locate, locateIfAllowed, type Position } from './location.ts';

const data = readData();
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

type Filters = { q: string; mo: boolean; buoi: string[]; loai: string[]; mon: string[]; gia: string[]; sap: string };
type ListKey = 'buoi' | 'loai' | 'mon' | 'gia';
const LIST_KEYS: ListKey[] = ['buoi', 'loai', 'mon', 'gia'];

const dishName = new Map(data.dishes.map((d) => [d.id, d.ten]));
const kindName = new Map(data.kinds.map((k) => [k.id, k.ten]));

// Precomputed search text per place (accent-insensitive).
const haystack = new Map(
  data.places.map((p) => [
    p.id,
    normalize([p.ten, p.monNenGoi, p.khuVuc, kindName.get(p.loai) ?? '', ...p.mon.map((m) => dishName.get(m) ?? m)].join(' ')),
  ]),
);

function readUrl(): Filters {
  const u = new URLSearchParams(location.search);
  const list = (k: string) => (u.get(k) ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return { q: u.get('q') ?? '', mo: u.get('mo') === '1', buoi: list('buoi'), loai: list('loai'), mon: list('mon'), gia: list('gia'), sap: u.get('sap') ?? 'cham' };
}

function writeUrl(f: Filters) {
  const u = new URLSearchParams();
  if (f.q) u.set('q', f.q);
  if (f.mo) u.set('mo', '1');
  for (const k of LIST_KEYS) if (f[k].length) u.set(k, f[k].join(','));
  if (f.sap !== 'cham') u.set('sap', f.sap);
  const qs = u.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

let filters = readUrl();
let position: Position | null = lastPosition();
// Filter edits inside the sheet are drafts until "Xem kết quả".
let draft: Filters = structuredClone(filters);

function matches(p: ClientPlace, f: Filters, now = vnNow()): boolean {
  if (f.q) {
    const words = normalize(f.q).split(/\s+/).filter(Boolean);
    const text = haystack.get(p.id) ?? '';
    if (!words.every((w) => text.includes(w))) return false;
  }
  if (f.mo && getStatus(p.hours, now).kind !== 'open') return false;
  if (f.buoi.length && !f.buoi.some((b) => b in BUOI && openDuring(p.hours, b as Buoi))) return false;
  if (f.loai.length && !f.loai.includes(p.loai)) return false;
  if (f.mon.length && !f.mon.some((m) => p.mon.includes(m))) return false;
  if (f.gia.length) {
    const buckets = PRICE_BUCKETS.filter((b) => f.gia.includes(b.id));
    if (!buckets.some((b) => inPriceBucket(p, b))) return false;
  }
  return true;
}

function sortPlaces(list: ClientPlace[], how: string): ClientPlace[] {
  const byName = (a: ClientPlace, b: ClientPlace) => a.ten.localeCompare(b.ten, 'vi');
  const copy = [...list];
  if (how === 'ten') return copy.sort(byName);
  if (how === 'gan' && position) {
    const from = position;
    return copy.sort((a, b) => distanceKm(from, a) - distanceKm(from, b));
  }
  if (how === 'gia') {
    const price = (p: ClientPlace) => p.giaTu ?? p.giaDen ?? Number.POSITIVE_INFINITY;
    return copy.sort((a, b) => price(a) - price(b) || byName(a, b));
  }
  return copy.sort((a, b) => ratingValue(b) - ratingValue(a) || byName(a, b));
}

const countActive = (f: Filters) => LIST_KEYS.reduce((n, k) => n + f[k].length, f.mo ? 1 : 0);

function render() {
  const now = vnNow();
  const shown = sortPlaces(data.places.filter((p) => matches(p, filters, now)), filters.sap);
  const list = $('cards');
  const items = new Map([...list.querySelectorAll<HTMLElement>('[data-id]')].map((li) => [li.dataset.id, li]));
  const visible = new Set(shown.map((p) => p.id));
  items.forEach((li, id) => (li.hidden = !visible.has(id ?? '')));
  shown.forEach((p) => {
    const li = items.get(p.id);
    if (li) list.appendChild(li);
  });
  paintStatuses(data.places, now);
  paintDistances(data.places, position);

  $('result-count').textContent = `${shown.length} chỗ${filters.mo ? ' đang mở' : ''}`;
  $('empty').hidden = shown.length > 0;
  if (shown.length === 0 && filters.mo) {
    const closedMatches = data.places.filter((p) => matches(p, { ...filters, mo: false }, now)).length;
    $('empty-hint').textContent = closedMatches
      ? `Có ${closedMatches} chỗ khớp nhưng đang đóng. Bỏ lọc "Đang mở" để xem.`
      : 'Thử bỏ bớt bộ lọc.';
  } else {
    $('empty-hint').textContent = 'Thử bỏ bớt bộ lọc.';
  }

  $('toggle-open').setAttribute('aria-pressed', String(filters.mo));
  $<HTMLInputElement>('q').value = filters.q;
  $<HTMLSelectElement>('sort').value = filters.sap;

  const listCount = countActive(filters) - (filters.mo ? 1 : 0);
  const badge = $('filter-count');
  badge.hidden = listCount === 0;
  badge.textContent = String(listCount);
  renderActiveChips();
  writeUrl(filters);
}

function labelFor(key: ListKey, value: string): string {
  if (key === 'mon') return dishName.get(value) ?? value;
  if (key === 'loai') return kindName.get(value) ?? value;
  if (key === 'buoi') return BUOI[value as Buoi]?.label ?? value;
  return PRICE_BUCKETS.find((b) => b.id === value)?.label ?? value;
}

function renderActiveChips() {
  const box = $('active-chips');
  box.replaceChildren();
  for (const key of LIST_KEYS) {
    for (const value of filters[key]) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip chip--on';
      chip.setAttribute('aria-label', `Bỏ lọc ${labelFor(key, value)}`);
      chip.append(labelFor(key, value));
      const x = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      x.setAttribute('width', '14');
      x.setAttribute('height', '14');
      x.setAttribute('viewBox', '0 0 24 24');
      x.setAttribute('fill', 'none');
      x.setAttribute('stroke', 'currentColor');
      x.setAttribute('stroke-width', '2.6');
      x.setAttribute('stroke-linecap', 'round');
      x.setAttribute('aria-hidden', 'true');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M6 6l12 12M18 6L6 18');
      x.append(path);
      chip.append(x);
      chip.addEventListener('click', () => {
        filters = { ...filters, [key]: filters[key].filter((v) => v !== value) };
        render();
      });
      box.append(chip);
    }
  }
}

// ---- Filter sheet ----
const sheet = $<HTMLDialogElement>('filters');

function syncSheet() {
  sheet.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((btn) => {
    const key = btn.dataset.filter as ListKey | 'mo';
    const on = key === 'mo' ? draft.mo : draft[key].includes(btn.dataset.value ?? '');
    btn.setAttribute('aria-pressed', String(on));
  });
  const n = data.places.filter((p) => matches(p, draft)).length;
  $('apply-filters').textContent = n ? `Xem ${n} chỗ` : 'Không có chỗ nào khớp';
}

$('open-filters').addEventListener('click', () => {
  draft = structuredClone(filters);
  syncSheet();
  sheet.showModal();
});

sheet.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.filter as ListKey | 'mo';
    const value = btn.dataset.value ?? '';
    if (key === 'mo') draft.mo = !draft.mo;
    else draft[key] = draft[key].includes(value) ? draft[key].filter((v) => v !== value) : [...draft[key], value];
    syncSheet();
  });
});

$('clear-filters').addEventListener('click', () => {
  draft = { ...draft, mo: false, buoi: [], loai: [], mon: [], gia: [] };
  syncSheet();
});

$('apply-filters').addEventListener('click', () => {
  filters = { ...draft, q: filters.q, sap: filters.sap };
  sheet.close();
  render();
});

// Tap on the dimmed area closes the sheet without applying.
sheet.addEventListener('click', (e) => {
  if (e.target === sheet) sheet.close();
});

// ---- Quick controls ----
$('toggle-open').addEventListener('click', () => {
  filters = { ...filters, mo: !filters.mo };
  render();
});

let typing: number | undefined;
$<HTMLInputElement>('q').addEventListener('input', (e) => {
  window.clearTimeout(typing);
  const value = (e.target as HTMLInputElement).value;
  typing = window.setTimeout(() => {
    filters = { ...filters, q: value.trim() };
    render();
  }, 150);
});
$('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  $<HTMLInputElement>('q').blur();
});

$<HTMLSelectElement>('sort').addEventListener('change', async (e) => {
  const select = e.target as HTMLSelectElement;
  if (select.value === 'gan' && !position) {
    select.disabled = true;
    toast('Đang lấy vị trí…');
    try {
      position = await locate();
    } catch (err) {
      toast((err as Error).message);
      select.value = filters.sap;
      return;
    } finally {
      select.disabled = false;
    }
  }
  filters = { ...filters, sap: select.value };
  render();
});

$('empty-reset').addEventListener('click', () => {
  filters = { q: '', mo: false, buoi: [], loai: [], mon: [], gia: [], sap: filters.sap };
  render();
});

render();
setInterval(() => paintStatuses(data.places), 60_000);

// Show distances without asking when the visitor already allowed location.
locateIfAllowed().then((p) => {
  if (p) position = p;
  if (!position && filters.sap === 'gan') filters = { ...filters, sap: 'cham' };
  render();
});
