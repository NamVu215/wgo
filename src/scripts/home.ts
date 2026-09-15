import { vnNow, currentBuoi, DAY_NAMES, hhmm, getStatus, statusLabel, type Buoi } from '../lib/hours.ts';
import {
  directionsUrl, distanceKm, formatDistance, matchesMood, MOODS, placeSubtitle, placeUrl, ratingText, type ClientPlace,
} from '../lib/view.ts';
import { photoUrl } from '../lib/photos.ts';
import { formatPrice } from '../lib/text.ts';
import { bindSaveButton, bindThemeToggle, readData, setTone, shuffle, toast, withStatus } from './common.ts';
import { locate, locateIfAllowed, type Position } from './location.ts';

const data = readData();
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const WHEN: Record<Buoi, string> = { sang: 'Sáng nay', trua: 'Trưa nay', chieu: 'Chiều nay', toi: 'Tối nay', khuya: 'Khuya rồi,' };

let mood = MOODS[0].id;
let queue: ClientPlace[] = [];
let index = 0;
let position: Position | null = null;

bindThemeToggle($('theme-toggle'));
const syncSave = bindSaveButton($('pick-save'));

function renderQuestion() {
  const now = vnNow();
  $('home-date').textContent = `${DAY_NAMES[now.day]} · ${hhmm(now.minutes)}`;
  $('home-when').textContent = WHEN[currentBuoi(now.minutes)];
  $('home-word').textContent = MOODS.find((m) => m.id === mood)?.word ?? 'ăn gì';
}

// Open places first (nearby first when position is known, then featured, then best rated,
// shuffled within ties), then places with unknown hours.
function buildQueue() {
  const now = vnNow();
  const list = withStatus(data.places.filter((p) => matchesMood(p, mood)), now);
  const rank = (p: ClientPlace) => (p.noiBat ? 10 : 0) + (p.wgoCham ?? 0);
  const ring = (p: ClientPlace) => {
    if (!position) return 0;
    const km = distanceKm(position, p);
    return km <= 2 ? 0 : km <= 5 ? 1 : 2;
  };
  const open = shuffle(list.filter((x) => x.status.kind === 'open').map((x) => x.place))
    .sort((a, b) => ring(a) - ring(b) || rank(b) - rank(a));
  const unknown = shuffle(list.filter((x) => x.status.kind === 'unknown').map((x) => x.place));
  queue = [...open, ...unknown];
  index = 0;
  renderPick();
}

function renderPick() {
  const now = vnNow();
  const place = queue[index];
  $('pick-media').hidden = !place;
  $('pick-body').hidden = !place;
  $('pick-empty').hidden = Boolean(place);

  if (!place) {
    renderEmpty();
    return;
  }

  const status = getStatus(place.hours, now);
  const label = statusLabel(status, now);
  const url = placeUrl(place.id);

  $<HTMLAnchorElement>('pick-name').textContent = place.ten;
  $<HTMLAnchorElement>('pick-name').href = url;
  $<HTMLAnchorElement>('pick-photo').href = url;
  const img = $<HTMLImageElement>('pick-img');
  img.hidden = !place.anh;
  if (place.anh) img.src = photoUrl(place.anh, 'lon');
  else img.removeAttribute('src');

  $('pick-sticker').textContent = place.noiBat ? 'WGo gợi ý' : 'Hợp giờ này';
  $('pick-rate').textContent = ratingText(place.wgoCham);
  $('pick-meta').textContent = [
    position ? formatDistance(distanceKm(position, place)) : '',
    place.monNenGoi || placeSubtitle(place, data.dishes, data.kinds, 2),
    formatPrice(place.giaTu, place.giaDen),
    place.khuVuc,
  ].filter(Boolean).join(' · ');
  const statusEl = $('pick-status');
  statusEl.textContent = label.tone === 'unknown' ? 'Chưa rõ giờ mở cửa · nên kiểm tra trước' : label.text;
  setTone(statusEl, label.tone);
  $<HTMLAnchorElement>('pick-go').href = directionsUrl(place);
  $('pick-save').dataset.save = place.id;
  syncSave();
  $('pick-next').hidden = queue.length < 2;
}

function renderEmpty() {
  const now = vnNow();
  const later = withStatus(data.places.filter((p) => matchesMood(p, mood)), now)
    .flatMap(({ place, status }) =>
      status.kind === 'closed' && status.opensAt !== null
        ? [{ place, wait: status.inDays * 1440 + status.opensAt - now.minutes, status }]
        : [],
    )
    .sort((a, b) => a.wait - b.wait)[0];

  const hint = $<HTMLAnchorElement>('pick-empty-hint');
  if (later) {
    hint.hidden = false;
    hint.href = placeUrl(later.place.id);
    hint.textContent = `Sớm nhất: ${later.place.ten} (${statusLabel(later.status, now).text.replace('Đã đóng · ', '')})`;
  } else {
    hint.hidden = true;
  }
}

function usePosition(p: Position) {
  position = p;
  const near = $('near-me');
  near.setAttribute('aria-pressed', 'true');
  $('near-text').textContent = 'Đang ưu tiên chỗ gần bạn';
  buildQueue();
}

$('near-me').addEventListener('click', async () => {
  if (position) return;
  $('near-text').textContent = 'Đang lấy vị trí…';
  try {
    usePosition(await locate());
  } catch (err) {
    $('near-text').textContent = 'Ưu tiên chỗ gần tôi';
    toast((err as Error).message);
  }
});

$('pick-next').addEventListener('click', () => {
  index = (index + 1) % queue.length;
  renderPick();
});

document.querySelectorAll<HTMLButtonElement>('[data-mood]').forEach((btn) => {
  btn.addEventListener('click', () => {
    mood = btn.dataset.mood ?? mood;
    document.querySelectorAll('[data-mood]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    renderQuestion();
    buildQueue();
  });
});

renderQuestion();
buildQueue();
locateIfAllowed().then((p) => {
  // Don't reshuffle once the visitor has started tapping "Đổi quán".
  if (p && !position && index === 0) usePosition(p);
});
// Keep the clock and "open" state fresh if the page stays open.
setInterval(() => {
  renderQuestion();
  renderPick();
}, 60_000);
