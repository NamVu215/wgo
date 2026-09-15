// Browser helpers shared by every page.
import { getStatus, statusLabel, vnNow, hhmm, type Status, type VnNow } from '../lib/hours.ts';
import { distanceKm, formatDistance, type ClientData, type ClientPlace, type LatLng } from '../lib/view.ts';

export function readJson<T>(id: string): T {
  const el = document.getElementById(id);
  return JSON.parse(el?.textContent ?? 'null') as T;
}

export const readData = () => readJson<ClientData>('wgo-data');

// ---- Saved places (this device only) ----
const SAVED_KEY = 'wgo:da-luu';

export function getSaved(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(SAVED_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function setSaved(ids: string[]): boolean {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}

export function isSaved(id: string): boolean {
  return getSaved().includes(id);
}

// Returns the new saved state.
export function toggleSaved(id: string): boolean {
  const ids = getSaved();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
  if (!setSaved(next)) {
    toast('Trình duyệt đang chặn lưu dữ liệu');
    return ids.includes(id);
  }
  return next.includes(id);
}

// Wires a heart button: <button data-save="place-id" aria-pressed>
export function bindSaveButton(btn: HTMLButtonElement, onChange?: (saved: boolean) => void) {
  const sync = () => {
    const id = btn.dataset.save ?? '';
    const saved = isSaved(id);
    btn.setAttribute('aria-pressed', String(saved));
    btn.setAttribute('aria-label', saved ? 'Bỏ lưu' : 'Lưu');
  };
  sync();
  btn.addEventListener('click', () => {
    const saved = toggleSaved(btn.dataset.save ?? '');
    sync();
    toast(saved ? 'Đã lưu' : 'Đã bỏ lưu');
    onChange?.(saved);
  });
  return sync;
}

// ---- Toast ----
let toastTimer: number | undefined;
export function toast(message: string) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('toast--show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('toast--show'), 2200);
}

// ---- Share & copy ----
export async function copyText(text: string, done = 'Đã sao chép'): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast(done);
  } catch {
    toast('Không sao chép được');
  }
}

export async function share(title: string, url: string): Promise<void> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (err) {
      if ((err as DOMException).name === 'AbortError') return;
    }
  }
  await copyText(url, 'Đã sao chép link');
}

// ---- Theme ----
export function bindThemeToggle(btn: HTMLButtonElement) {
  const root = document.documentElement;
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const sync = () => {
    const dark = isDark();
    btn.querySelector('[data-icon="moon"]')?.toggleAttribute('hidden', dark);
    btn.querySelector('[data-icon="sun"]')?.toggleAttribute('hidden', !dark);
    btn.setAttribute('aria-label', dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  };
  sync();
  btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('wgo:theme', next);
    } catch {
      // Theme still switches for this visit.
    }
    sync();
  });
}

// ---- Opening status ----
export type WithStatus = { place: ClientPlace; status: Status };

export function withStatus(places: ClientPlace[], now: VnNow): WithStatus[] {
  return places.map((place) => ({ place, status: getStatus(place.hours, now) }));
}

export function shortStatus(s: Status, now: VnNow): { text: string; tone: string } {
  if (s.kind === 'open') return { text: s.allDay ? 'Mở cả ngày' : `Tới ${hhmm(s.closesAt)}`, tone: 'open' };
  if (s.kind === 'unknown') return { text: 'Chưa rõ giờ', tone: 'unknown' };
  return { text: statusLabel(s, now).text.replace('Đã đóng · ', 'Đóng · '), tone: 'closed' };
}

export function setTone(el: Element, tone: string) {
  el.classList.remove('tone-open', 'tone-closed', 'tone-unknown');
  el.classList.add(`tone-${tone}`);
}

// Fills every <span data-status="id"> on the page.
export function paintStatuses(places: ClientPlace[], now: VnNow = vnNow()) {
  const byId = new Map(places.map((p) => [p.id, p]));
  document.querySelectorAll<HTMLElement>('[data-status]').forEach((el) => {
    const place = byId.get(el.dataset.status ?? '');
    if (!place) return;
    const { text, tone } = shortStatus(getStatus(place.hours, now), now);
    el.textContent = text;
    setTone(el, tone);
  });
}

// Fills every <span data-distance="id"> on the page (empty when position is unknown).
export function paintDistances(places: ClientPlace[], from: LatLng | null) {
  const byId = new Map(places.map((p) => [p.id, p]));
  document.querySelectorAll<HTMLElement>('[data-distance]').forEach((el) => {
    const place = byId.get(el.dataset.distance ?? '');
    el.textContent = place && from ? formatDistance(distanceKm(from, place)) : '';
  });
}

// Higher is better: rated places first, then featured.
export function ratingValue(p: ClientPlace): number {
  return (p.wgoCham ?? 0) + (p.noiBat ? 0.01 : 0);
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
