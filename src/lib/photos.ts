// Photo links from the `anh` column. Pure functions, shared by build scripts and tests.

export const MAX_PHOTOS = 4;
export const PHOTO_SIZES = { nho: 480, lon: 1080 } as const;
export type PhotoSize = keyof typeof PHOTO_SIZES;

export type PhotoSource = { link: string; download: string };

const DRIVE_ID = /^[\w-]{20,}$/;

// A Google Drive share link or a direct https link to an image → where to download it from.
// Returns an error message (Vietnamese) when the link can't be used.
export function photoSource(raw: string): PhotoSource | { error: string } {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { error: `ảnh "${raw}" không phải link (dán link Google Drive của ảnh)` };
  }
  if (url.protocol !== 'https:') return { error: `link ảnh phải bắt đầu bằng https://` };

  if (url.hostname === 'drive.google.com' || url.hostname === 'docs.google.com') {
    const id = /\/file\/d\/([^/]+)/.exec(url.pathname)?.[1] ?? url.searchParams.get('id') ?? '';
    if (!DRIVE_ID.test(id)) return { error: `link Google Drive "${raw}" không có mã ảnh (dùng nút Chia sẻ → Sao chép đường liên kết)` };
    return { link: raw.trim(), download: `https://drive.google.com/uc?export=download&id=${id}` };
  }
  if (/(^|\.)photos\.(app\.goo\.gl|google\.com)$/.test(url.hostname)) {
    return { error: 'link Google Photos không tải được ảnh, hãy đưa ảnh lên Google Drive' };
  }
  return { link: raw.trim(), download: url.toString() };
}

export const photoUrl = (id: string, size: PhotoSize = 'nho') => `/anh/${id}-${PHOTO_SIZES[size]}.webp`;
