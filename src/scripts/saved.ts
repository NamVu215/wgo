import { getStatus, vnNow } from '../lib/hours.ts';
import { placeUrl } from '../lib/view.ts';
import { bindSaveButton, getSaved, paintStatuses, readData, toast } from './common.ts';

const data = readData();
const list = document.getElementById('cards') as HTMLElement;
const items = new Map([...list.querySelectorAll<HTMLElement>('[data-id]')].map((li) => [li.dataset.id ?? '', li]));

function render() {
  const now = vnNow();
  const saved = getSaved().filter((id) => items.has(id));
  const open = new Set(
    data.places.filter((p) => saved.includes(p.id) && getStatus(p.hours, now).kind === 'open').map((p) => p.id),
  );

  items.forEach((li, id) => {
    li.hidden = !saved.includes(id);
    li.classList.toggle('card--dim', !open.has(id));
  });
  // Most recently saved first.
  saved.forEach((id) => list.appendChild(items.get(id) as HTMLElement));
  paintStatuses(data.places, now);

  document.getElementById('saved-summary')!.textContent = saved.length
    ? `${saved.length} chỗ · ${open.size} đang mở · chỉ lưu trên điện thoại này`
    : 'Chỉ lưu trên điện thoại này';
  (document.getElementById('empty') as HTMLElement).hidden = saved.length > 0;
  (document.getElementById('pick-saved') as HTMLElement).hidden = saved.length < 2;
}

list.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((btn) => bindSaveButton(btn, render));

document.getElementById('pick-saved')?.addEventListener('click', () => {
  const now = vnNow();
  const open = data.places.filter((p) => getSaved().includes(p.id) && getStatus(p.hours, now).kind === 'open');
  if (open.length === 0) {
    toast('Chưa có chỗ nào đang mở');
    return;
  }
  location.href = placeUrl(open[Math.floor(Math.random() * open.length)].id);
});

render();
setInterval(render, 60_000);
