import { test } from 'node:test';
import assert from 'node:assert/strict';
import { photoSource, photoUrl } from '../src/lib/photos.ts';

const ID = '1AbCdEfGhIjKlMnOpQrStUvWxYz012345';

test('Google Drive share links become download links', () => {
  for (const link of [
    `https://drive.google.com/file/d/${ID}/view?usp=sharing`,
    `https://drive.google.com/file/d/${ID}/view?usp=drive_link`,
    `https://drive.google.com/open?id=${ID}`,
    `https://drive.google.com/uc?export=download&id=${ID}`,
  ]) {
    assert.deepEqual(photoSource(link), { link, download: `https://drive.google.com/uc?export=download&id=${ID}` }, link);
  }
});

test('direct https image links are used as they are', () => {
  const link = 'https://example.com/anh/bun-bo.jpg';
  assert.deepEqual(photoSource(link), { link, download: link });
});

test('unusable photo values explain what to do', () => {
  assert.match((photoSource('me-keo-1.jpg') as { error: string }).error, /không phải link/);
  assert.match((photoSource('http://example.com/a.jpg') as { error: string }).error, /https/);
  assert.match((photoSource('https://photos.app.goo.gl/abc') as { error: string }).error, /Google Drive/);
  assert.match((photoSource('https://drive.google.com/drive/folders/') as { error: string }).error, /mã ảnh/);
});

test('photo file names', () => {
  assert.equal(photoUrl('0123456789abcdef'), '/anh/0123456789abcdef-480.webp');
  assert.equal(photoUrl('0123456789abcdef', 'lon'), '/anh/0123456789abcdef-1080.webp');
});
