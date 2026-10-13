// Test 25: full-screen photos — opened at the one tapped, swiped through with a
// counter, and closed with the ✕.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';
import { makePng } from './_png.js';

const png = (name) => ({ name, mimeType: 'image/png', buffer: makePng(80, 60) });

test('full-screen photos open at the tapped one, swipe through, and close', async ({ page }) => {
  await openApp(page);
  await page.getByTestId('fab-add').click();
  await page.getByTestId('f-term').fill(`Gallery ${Date.now()}`);
  await page.getByTestId('f-photo').setInputFiles([png('a.png'), png('b.png'), png('c.png')]);
  await expect(page.getByTestId('f-photo-thumb')).toHaveCount(3);
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();

  // Tap the second photo on the page: full screen opens on it, "2 of 3".
  await page.getByTestId('detail-photos').evaluate((el) => el.scrollTo({ left: el.clientWidth }));
  await page.getByTestId('detail-photo').nth(1).click();
  await expect(page.locator('body[data-lightbox="open"]')).toBeAttached();
  await expect(page.getByTestId('lightbox-counter')).toHaveAttribute('data-count', '3');
  await expect(page.getByTestId('lightbox-counter')).toHaveAttribute('data-index', '1');

  // Swipe on: the third.
  await page.getByTestId('lightbox-strip').evaluate((el) => el.scrollTo({ left: 2 * el.clientWidth }));
  await expect(page.getByTestId('lightbox-counter')).toHaveAttribute('data-index', '2');

  // Close.
  await page.getByTestId('lightbox-close').click();
  await expect(page.locator('body[data-lightbox="closed"]')).toBeAttached();
  await expect(page.getByTestId('lightbox')).toBeHidden();
});
