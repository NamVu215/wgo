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
  },
};

export const CITY = { id: 'hue', name: 'Huế' };

// Public address of the site, used for share previews. Change after the
// Cloudflare Pages project is created if the name differs.
export const SITE_URL = 'https://wgo-auc.pages.dev';
