import type { ClientPlace } from '../lib/view.ts';
import { bindSaveButton, copyText, paintStatuses, readJson, share } from './common.ts';

const place = readJson<ClientPlace>('wgo-place');

paintStatuses([place]);
setInterval(() => paintStatuses([place]), 60_000);

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
