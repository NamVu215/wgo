// Service worker registration, install prompt and offline notice. Loaded on every page.
import { toast } from './common.ts';

if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // WGo still works online without it.
    });
  });
}

window.addEventListener('offline', () => toast('Mất mạng · WGo vẫn dùng được'));
window.addEventListener('online', () => toast('Có mạng lại rồi'));

// ---- "Cài WGo lên màn hình" (home page only) ----
const DISMISS_KEY = 'wgo:an-cai-dat';
const card = document.getElementById('install-card');

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
let deferred: InstallPrompt | null = null;

const standalone = matchMedia('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function dismissedRecently(): boolean {
  try {
    return Date.now() - Number(localStorage.getItem(DISMISS_KEY) ?? 0) < 30 * 24 * 3600_000;
  } catch {
    return false;
  }
}

if (card && !standalone && !dismissedRecently()) {
  const guide = document.getElementById('install-guide') as HTMLDialogElement | null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallPrompt;
    card.hidden = false;
  });
  // iPhone/iPad never fire beforeinstallprompt: show the manual steps instead.
  if (ios) card.hidden = false;

  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      deferred = null;
      if (outcome === 'accepted') card.hidden = true;
    } else {
      guide?.showModal();
    }
  });
  document.getElementById('install-later')?.addEventListener('click', () => {
    card.hidden = true;
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Hidden for this visit only.
    }
  });
  guide?.addEventListener('click', (e) => {
    if (e.target === guide || (e.target as HTMLElement).closest('[data-close]')) guide.close();
  });
  window.addEventListener('appinstalled', () => {
    card.hidden = true;
  });
}
