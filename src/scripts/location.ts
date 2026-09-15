// Visitor position for "Gần tôi". Kept for this visit only (sessionStorage), never sent anywhere.
import type { LatLng } from '../lib/view.ts';

const KEY = 'wgo:vi-tri';
const MAX_AGE = 10 * 60_000;

export type Position = LatLng & { accuracy: number; at: number };

export function lastPosition(): Position | null {
  try {
    const p = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') as Position | null;
    return p && Date.now() - p.at < MAX_AGE ? p : null;
  } catch {
    return null;
  }
}

function remember(p: Position) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // Still usable on this page.
  }
}

const MESSAGES: Record<number, string> = {
  1: 'WGo chưa được phép xem vị trí. Bật lại trong cài đặt trình duyệt.',
  2: 'Không lấy được vị trí. Thử ra chỗ thoáng hơn.',
  3: 'Lấy vị trí quá lâu. Thử lại nhé.',
};

// Asks the browser (shows the permission prompt the first time). Rejects with a Vietnamese message.
export function locate(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Trình duyệt này không hỗ trợ lấy vị trí.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, at: Date.now() };
        remember(p);
        resolve(p);
      },
      (err) => reject(new Error(MESSAGES[err.code] ?? MESSAGES[2])),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    );
  });
}

// Position without prompting: the recent one, or a fresh one if permission was already granted.
export async function locateIfAllowed(): Promise<Position | null> {
  const recent = lastPosition();
  if (recent) return recent;
  try {
    const state = await navigator.permissions?.query({ name: 'geolocation' });
    if (state?.state !== 'granted') return null;
    return await locate();
  } catch {
    return null;
  }
}
