// Start page: open the last city right away (unless ?chon=1), otherwise wait for a choice.
import { readJson } from './common.ts';

const KEY = 'wgo:thanh-pho';
const box = document.getElementById('city-choice') as HTMLElement;
const page = box.dataset.page ?? '';
const cities = readJson<string[]>('wgo-cities') ?? [];
const params = new URLSearchParams(location.search);
const choosing = params.get('chon') === '1';
params.delete('chon');
const query = params.toString() ? `?${params}` : '';

const target = (city: string) => `/${city}/${page ? `${page}/` : ''}${query}`;

let saved = '';
try {
  saved = localStorage.getItem(KEY) ?? '';
} catch {
  // Private mode: always show the choice.
}

if (!choosing && cities.includes(saved)) location.replace(target(saved));
else if (!choosing && cities.length === 1) location.replace(target(cities[0]));
else box.hidden = false;

// Keep filters from shared links (/kham-pha/?mon=…) when a city is picked.
box.querySelectorAll<HTMLAnchorElement>('[data-city-link]').forEach((a) => {
  a.href = target(a.dataset.cityLink ?? '');
  if (a.dataset.cityLink === saved) a.setAttribute('aria-current', 'true');
});
