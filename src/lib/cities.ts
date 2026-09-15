// Which city each place belongs to. Pure functions, shared by the build and tests.
import { CITIES, type City } from '../config.ts';
import type { Issue, Place } from './data.ts';

export { CITIES, type City };

export const findCity = (id: string): City | undefined => CITIES.find((c) => c.id === id);

// How far outside the map area a place may be before we warn (about 5 km).
const MARGIN = 0.05;

// Drops places whose city WGo doesn't cover yet, and warns when coordinates fall outside the city.
export function checkCities(places: Place[], issues: Issue[], cities: City[] = CITIES): Place[] {
  return places.filter((p) => {
    const city = cities.find((c) => c.id === p.thanhPho);
    if (!city) {
      issues.push({ dong: p.dong, id: p.id, muc: 'loi', noiDung: `thanh_pho "${p.thanhPho}" chưa có trong WGo (đang có: ${cities.map((c) => c.id).join(', ')})` });
      return false;
    }
    const [west, south, east, north] = city.bounds;
    if (p.lng < west - MARGIN || p.lng > east + MARGIN || p.lat < south - MARGIN || p.lat > north + MARGIN) {
      issues.push({ dong: p.dong, id: p.id, muc: 'canh-bao', noiDung: `tọa độ ${p.lat}, ${p.lng} nằm ngoài ${city.name}, kiểm tra lại vi_do, kinh_do hoặc thanh_pho` });
    }
    return true;
  });
}

// Cities that have at least one place, in config order.
export const citiesWithPlaces = (places: Pick<Place, 'thanhPho'>[], cities: City[] = CITIES) =>
  cities.filter((c) => places.some((p) => p.thanhPho === c.id));

export const cityHref = (city: string, page: '' | 'kham-pha' | 'ban-do' = '') => `/${city}/${page ? `${page}/` : ''}`;
