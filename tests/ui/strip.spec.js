// Test 5: the photos sit in a strip you swipe sideways, and the definition is
// right under it — however many photos there are and however tall they are.
// (Tall ones on purpose: three phone screenshots stacked would push the
// definition thousands of pixels down, which is the thing this guards against.)
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';
import { makePng } from './_png.js';

const tall = (name) => ({ name, mimeType: 'image/png', buffer: makePng(60, 1300) });

test('photos sit in a swipe strip with the definition right under it', async ({ page }) => {
  await openApp(page);
  const term = `Strip ${Date.now()}`;

  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('Three tall screenshots, and still readable first.');
  await page.getByTestId('f-photo').setInputFiles([tall('a.png'), tall('b.png'), tall('c.png')]);
  await expect(page.getByTestId('f-photo-thumb')).toHaveCount(3);
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.getByTestId('detail-photo')).toHaveCount(3);

  // The definition is on screen on arrival — under the strip, not under three tall photos.
  const viewport = page.viewportSize();
  const strip = await page.getByTestId('detail-photos').boundingBox();
  const def = await page.getByTestId('detail-definition').boundingBox();
  expect(def.y, 'the definition starts under the strip').toBeGreaterThan(strip.y + strip.height - 1);
  expect(def.y + 60, 'and is on screen without scrolling').toBeLessThan(viewport.height);

  // Swiping moves to the next photo, and the dots say so.
  await expect(page.getByTestId('photo-dot')).toHaveCount(3);
  await expect(page.getByTestId('detail-photos')).toHaveAttribute('data-index', '0');
  await page.getByTestId('detail-photos').evaluate((el) => el.scrollTo({ left: el.clientWidth }));
  await expect(page.getByTestId('detail-photos')).toHaveAttribute('data-index', '1');
  await expect(page.getByTestId('photo-dot').nth(1)).toHaveAttribute('data-on', '1');
  await expect(page.getByTestId('photo-dot').nth(0)).toHaveAttribute('data-on', '0');
});
