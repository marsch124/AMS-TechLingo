// Test 3: a word can carry several photos — added in one go (as the iPhone
// picker allows), taken away one at a time, kept across a restart, and every
// one of them travels with a share.
import { test, expect } from '@playwright/test';
import { openApp, restartApp, openWord } from './_app.js';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64');
const png = (name) => ({ name, mimeType: 'image/png', buffer: PNG });

test('a word can carry several photos', async ({ page }) => {
  await page.addInitScript(() => {
    window.__shared = null;
    navigator.share = async (data) => {
      window.__shared = { files: (data.files || []).map((f) => ({ name: f.name, type: f.type })) };
    };
    navigator.canShare = () => true;
  });

  await openApp(page);
  const term = `Gallery ${Date.now()}`;

  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);

  // Two at once.
  await page.getByTestId('f-photo').setInputFiles([png('a.png'), png('b.png')]);
  await expect(page.getByTestId('f-photo-thumb')).toHaveCount(2);
  // One taken away, one more added.
  await page.getByTestId('f-photo-remove').first().click();
  await expect(page.getByTestId('f-photo-thumb')).toHaveCount(1);
  await page.getByTestId('f-photo').setInputFiles([png('c.png')]);
  await expect(page.getByTestId('f-photo-thumb')).toHaveCount(2);

  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.getByTestId('detail-photo')).toHaveCount(2);

  // Saved, not merely shown: still two after a restart.
  await restartApp(page);
  await openWord(page, term);
  await expect(page.getByTestId('detail-photo')).toHaveCount(2);

  // And both go with a share.
  await page.getByTestId('detail-share').click();
  await expect(page.locator('body[data-share="shared"]')).toBeAttached();
  const shared = await page.evaluate(() => window.__shared);
  expect(shared.files, 'every photo travels').toHaveLength(2);
  expect(new Set(shared.files.map((f) => f.name)).size, 'with distinct names').toBe(2);
});
