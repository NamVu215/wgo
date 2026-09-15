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
    'danh-gia': '2011447134',
  },
};

// Community (docs/09). Links come from the Apps Script setup (apps-script/gop-y.gs).
// __MA__ and __TEN__ are replaced with the place id and name. Empty link = button hidden.
export const COMMUNITY = {
  danhGiaForm: 'https://docs.google.com/forms/d/e/1FAIpQLScueAfG8QAfLyoSackKBkGw1AmO6U-hlxBna5DyJ8N4LJCu_A/viewform?usp=pp_url&entry.1935074018=__MA__&entry.647746806=__TEN__',
  gopYForm: 'https://docs.google.com/forms/d/e/1FAIpQLScO4l3rJzby8_Mn5-nMVaAF8UdBwUeXukzV9BkevxCe0yzkjw/viewform?usp=pp_url&entry.469645940=__MA__&entry.1840336756=__TEN__',
  // A community score shows only after this many approved reviews.
  minReviews: 3,
};

export type City = { id: string; name: string; bounds: [number, number, number, number] };

// Cities WGo covers. `id` is the value of the thanh_pho column and the start of every link
// (/hue/…, /vung-tau/…). A city appears on the site once the Sheet has at least one place for it.
// bounds = map area [west, south, east, north]. After adding a city or changing bounds,
// run `npm run tai-ban-do -- <id>` to download its basemap.
export const CITIES: City[] = [
  // The city plus the royal tombs to the south.
  { id: 'hue', name: 'Huế', bounds: [107.48, 16.35, 107.7, 16.56] },
  // The peninsula (Bãi Trước, Bãi Sau, Núi Nhỏ, Núi Lớn) and the coast to Long Hải.
  { id: 'vung-tau', name: 'Vũng Tàu', bounds: [107.04, 10.31, 107.28, 10.47] },
  // The old inner districts: Quận 1, 3, 4, 5, 10, Phú Nhuận, Bình Thạnh, Tân Bình, Gò Vấp, Quận 7.
  { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', bounds: [106.6, 10.7, 106.76, 10.86] },
  // The former Thủ Đức city (Quận 2, Quận 9, Thủ Đức) plus the university village. Kept separate from
  // ho-chi-minh on purpose: it is far enough to be its own trip. Taller than the area itself so a
  // portrait phone can show all of it at once (its places spread ~14 km east–west).
  { id: 'thu-duc', name: 'Thủ Đức', bounds: [106.69, 10.69, 106.88, 10.96] },
  // Xã Phước Thái (Đồng Nai, merged with Tân Hiệp and Phước Bình in 2025) along Quốc lộ 51,
  // south of Long Thành airport. Taller than the commune for the same portrait-phone reason.
  { id: 'phuoc-thai', name: 'Phước Thái', bounds: [106.99, 10.6, 107.15, 10.77] },
];

// Public address of the site, used for share previews. Change after the
// Cloudflare Pages project is created if the name differs.
export const SITE_URL = 'https://wgo-auc.pages.dev';
