// Test 2: a word written just now — with a photo — opens on its own page and
// can be shared: the share sheet is handed the word, the definition, the notes
// and the photo. This is the whole reason for 1.5.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

// A 1×1 PNG: enough for the app to shrink into its JPEG.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64');

test('a new word opens on its own page and can be shared with its photo', async ({ page }) => {
  // Stand in for the share sheet: record exactly what the app hands it.
  await page.addInitScript(() => {
    window.__shared = null;
    navigator.share = async (data) => {
      window.__shared = {
        title: data.title,
        text: data.text,
        files: (data.files || []).map((f) => ({ name: f.name, type: f.type, size: f.size })),
      };
    };
    navigator.canShare = () => true;
  });

  await openApp(page);
  const term = `Testword ${Date.now()}`;

  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('A word made by the test.');
  await page.getByTestId('f-notes').fill('Told you so');
  await page.getByTestId('f-photo').setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: PNG });
  await expect(page.getByTestId('f-photo-preview')).toBeVisible();
  await page.getByTestId('edit-save').click();

  // Saving lands on the word itself, not back in the list.
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.getByTestId('detail-term')).toHaveText(term);

  await page.getByTestId('detail-share').click();
  await expect(page.locator('body[data-share="shared"]')).toBeAttached();

  const shared = await page.evaluate(() => window.__shared);
  expect(shared.title).toBe(term);
  // The greeting comes first — the receiver should know what this is before the word.
  expect(shared.text.split('\n')[0]).toBe('Hello, this is Martin who wants to share Tech Lingo with you.');
  expect(shared.text).toContain(term);
  expect(shared.text).toContain('A word made by the test.');
  expect(shared.text).toContain('Told you so');
  expect(shared.files, 'the photo travels with the text').toHaveLength(1);
  expect(shared.files[0].type).toBe('image/jpeg');
  expect(shared.files[0].size).toBeGreaterThan(0);
});
