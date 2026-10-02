// Test 4: a word saved by an older version — ONE photo, in the old `photo`
// field — keeps that photo when the app updates. This runs once per device and
// would fail silently (the photo would simply not be there), so it gets its
// own test.
import { test, expect } from '@playwright/test';
import { openApp, restartApp, openWord } from './_app.js';

const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const PNG_BYTES = Buffer.from(PNG_B64, 'base64').length;

test('a word from an older version keeps its photo', async ({ page }) => {
  await openApp(page);

  // Plant a word straight into the database in the shape 1.6 wrote it.
  const id = await page.evaluate(async (b64) => {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const id = 'old-' + Date.now();
    const now = new Date().toISOString();
    await TL_DB.putEntry({
      id, term: 'Oldword ' + id, category: 'Software & Apps',
      en: 'From before the photo list', de: '', sv: '', notes: '',
      favorite: false, source: 'own', createdAt: now, updatedAt: now,
      photo: new Blob([arr], { type: 'image/png' })
    });
    return id;
  }, PNG_B64);

  await restartApp(page);

  // In the store: a photo list holding that photo, and the old field gone.
  const shape = await page.evaluate(async (id) => {
    const e = (await TL_DB.getAllEntries()).find((x) => x.id === id);
    return {
      photos: Array.isArray(e.photos) ? e.photos.length : -1,
      oldField: 'photo' in e,
      bytes: e.photos && e.photos[0] ? e.photos[0].size : 0
    };
  }, id);
  expect(shape).toEqual({ photos: 1, oldField: false, bytes: PNG_BYTES });

  // And on the page.
  await openWord(page, 'Oldword ' + id);
  await expect(page.getByTestId('detail-photo')).toHaveCount(1);
});
