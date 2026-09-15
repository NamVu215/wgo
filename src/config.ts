// Where WGo reads its data from.
//
// While `sheetId` is empty, the build uses the sample CSV files in data/<city>/.
// Once the Google Sheet exists (shared as "Anyone with the link can view"), fill in:
//   sheetId: the long id in https://docs.google.com/spreadsheets/d/<sheetId>/edit
//   gid:     the number after "gid=" in the URL when each tab is open.
export const DATA_SOURCE = {
  sheetId: '1ricr-8XcL58OSaPFGEcQccu2pV1QMT8fLpOOU7IWeGo',
  gid: {
    'dia-diem': '742979991',
    mon: '1842662037',
    loai: '793024044',
    tags: '1285618604',
    // Community reviews approved by the owner. Empty until the Apps Script setup has run.
    'danh-gia': '',
  },
};

// Community (docs/09). Links come from the Apps Script setup (apps-script/gop-y.gs).
// __MA__ and __TEN__ are replaced with the place id and name. Empty link = button hidden.
export const COMMUNITY = {
  danhGiaForm: '',
  gopYForm: '',
  // A community score shows only after this many approved reviews.
  minReviews: 3,
};

export const CITY = {
  id: 'hue',
  name: 'Huế',
  // Map area [west, south, east, north]: the city plus the royal tombs to the south.
  // After changing it, run `npm run tai-ban-do` to download the basemap again.
  bounds: [107.48, 16.35, 107.7, 16.56] as [number, number, number, number],
};

// Public address of the site, used for share previews. Change after the
// Cloudflare Pages project is created if the name differs.
export const SITE_URL = 'https://wgo-auc.pages.dev';
