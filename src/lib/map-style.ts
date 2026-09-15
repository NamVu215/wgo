// MapLibre style for the self-hosted basemap in public/nen-ban-do (see scripts/tai-ban-do.ts).
import { layers, namedFlavor, type Flavor } from '@protomaps/basemaps';
import type { StyleSpecification } from 'maplibre-gl';

// Warm tones that sit well with WGo's cream/ink palette. POIs are left out: WGo pins are the content.
const LIGHT: Partial<Flavor> = {
  background: '#efe7d7', earth: '#f3ecdf', water: '#b7d5de', park_a: '#dde6c8', park_b: '#c9dcb1',
  wood_a: '#dde6c8', wood_b: '#c9dcb1', buildings: '#e4dac8', minor_a: '#fffdf8', minor_b: '#fffdf8',
  city_label: '#4d453b', subplace_label: '#6f665a', roads_label_minor: '#8a8175', roads_label_major: '#6f665a',
  pois: undefined,
};
const DARK: Partial<Flavor> = {
  background: '#15120e', earth: '#1c1813', water: '#243238', park_a: '#1f261b', park_b: '#232c1e',
  wood_a: '#1f261b', wood_b: '#232c1e', buildings: '#26211a', minor_a: '#2e2920', minor_b: '#2e2920',
  major: '#3a342a', highway: '#453d31', city_label: '#cfc5b4', subplace_label: '#a89e8e',
  roads_label_minor: '#8d8475', roads_label_major: '#a89e8e', pois: undefined,
};

export function mapStyle(cityId: string, bounds: [number, number, number, number], dark: boolean): StyleSpecification {
  const origin = location.origin;
  const flavor = { ...namedFlavor(dark ? 'dark' : 'light'), ...(dark ? DARK : LIGHT) } as Flavor;
  return {
    version: 8,
    glyphs: `${origin}/nen-ban-do/fonts/{fontstack}/{range}.pbf`,
    sprite: `${origin}/nen-ban-do/sprites/${dark ? 'dark' : 'light'}`,
    sources: {
      protomaps: {
        type: 'vector',
        tiles: [`${origin}/nen-ban-do/${cityId}/{z}/{x}/{y}.mvt`],
        minzoom: 10,
        maxzoom: 15,
        bounds,
        attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap</a> · <a href="https://protomaps.com">Protomaps</a>',
      },
    },
    layers: layers('protomaps', flavor, { lang: 'vi' }),
  };
}
