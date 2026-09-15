import { DAY_NAMES, LUNAR_NAMES, nextLunarOff, vnNow } from '../lib/hours.ts';
import { jdToDate } from '../lib/lunar.ts';
import { distanceKm, formatDistance, type ClientPlace } from '../lib/view.ts';
import { bindSaveButton, copyText, paintStatuses, readJson, share } from './common.ts';
import { locateIfAllowed } from './location.ts';

const place = readJson<ClientPlace>('wgo-place');
const nearby = readJson<ClientPlace[]>('wgo-nearby') ?? [];

paintStatuses([place, ...nearby]);

// "Rằm tới: Thứ Sáu 25/09" for places closed on lunar days.
const lunarEl = document.getElementById('lunar-next');
const today = vnNow().jd;
const next = lunarEl && today !== undefined ? nextLunarOff(place.hours, today) : null;
if (lunarEl && next && today !== undefined) {
  const { d, m, y } = jdToDate(next.jd);
  const weekday = DAY_NAMES[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const name = LUNAR_NAMES[next.kind];
  lunarEl.textContent = next.jd === today
    ? `Hôm nay là ${name} âm lịch, quán nghỉ.`
    : `${name[0].toUpperCase()}${name.slice(1)} tới: ${weekday} ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
  lunarEl.hidden = false;
}

locateIfAllowed().then((p) => {
  const el = document.getElementById('distance');
  if (!p || !el) return;
  el.textContent = `Cách bạn khoảng ${formatDistance(distanceKm(p, place))}`;
  el.hidden = false;
});
setInterval(() => paintStatuses([place, ...nearby]), 60_000);

bindSaveButton(document.getElementById('save') as HTMLButtonElement);

document.getElementById('share')?.addEventListener('click', () => {
  share(`${place.ten} · WGo`, location.href);
});

document.getElementById('copy-address')?.addEventListener('click', (e) => {
  copyText((e.currentTarget as HTMLElement).dataset.address ?? '', 'Đã sao chép địa chỉ');
});

// Go back to the list the visitor came from; fall back to the home page for shared links.
const back = document.getElementById('back') as HTMLAnchorElement;
back.addEventListener('click', (e) => {
  const cameFromWGo = document.referrer && new URL(document.referrer).origin === location.origin;
  if (cameFromWGo && history.length > 1) {
    e.preventDefault();
    history.back();
  }
});
