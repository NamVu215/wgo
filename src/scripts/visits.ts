// Counts a visit (at most once per 30 minutes of browsing on this device) and shows the totals on the home page.
const KEY = 'wgo:lan-ghe';
const SESSION = 30 * 60_000;

type Totals = { tong: number; homNay: number };

function isNewVisit(): boolean {
  try {
    const last = Number(localStorage.getItem(KEY) ?? 0);
    localStorage.setItem(KEY, String(Date.now()));
    return Date.now() - last > SESSION;
  } catch {
    return false;
  }
}

async function run() {
  const el = document.getElementById('luot-ghe');
  const count = isNewVisit();
  if (!count && !el) return;
  try {
    const res = await fetch('/api/luot-xem', { method: count ? 'POST' : 'GET', headers: { accept: 'application/json' } });
    if (!res.ok || !el) return;
    const { tong, homNay } = (await res.json()) as Totals;
    const n = (v: number) => v.toLocaleString('vi-VN');
    el.textContent = `${n(tong)} lượt ghé WGo · ${n(homNay)} hôm nay`;
    el.hidden = false;
  } catch {
    // Offline or counter unavailable: show nothing.
  }
}

run();
