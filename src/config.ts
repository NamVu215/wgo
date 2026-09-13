// Where WGo reads its data from.
//
// While `sheetId` is empty, the build uses the sample CSV files in data/<city>/.
// Once the Google Sheet exists (shared as "Anyone with the link can view"), fill in:
//   sheetId: the long id in https://docs.google.com/spreadsheets/d/<sheetId>/edit
//   gid:     the number after "gid=" in the URL when each tab is open.
export const DATA_SOURCE = {
  sheetId: '',
  gid: {
    'dia-diem': '0',
    mon: '',
    loai: '',
    tags: '',
  },
};

export const CITY = { id: 'hue', name: 'Huế' };

// Public address of the site, used for share previews. Change after the
// Cloudflare Pages project is created if the name differs.
export const SITE_URL = 'https://wgo-auc.pages.dev';
