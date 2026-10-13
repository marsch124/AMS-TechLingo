// Test 7: on an iPhone opened from the Home Screen, iOS draws a soft blur over
// the strip just under the clock (measured on his phone: it fades out ~45–50 pt
// below the top inset). Every screen's top bar — and the full-screen photo —
// must start clear of it. On a screen without that inset (the Mac), nothing moves.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';
import { makePng } from './_png.js';

// The phone's real top / bottom insets (iPhone 17 Pro class), applied by the
// browser engine itself so the page's own env(safe-area-inset-*) sees them.
async function insets(page, top, bottom) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setSafeAreaInsetsOverride', { insets: { top, bottom } });
}
const topOf = (page, id) => page.getByTestId(id).evaluate((el) => el.getBoundingClientRect().top);
const CLEAR = 62 + 48;

async function allClear(page, ids) {
  for (const id of ids) {
    expect(await topOf(page, id), `${id} starts below the blur`).toBeGreaterThanOrEqual(CLEAR);
  }
}

test('every top bar starts below the blur under the clock', async ({ page }) => {
  await insets(page, 62, 34);
  await openApp(page);
  await allClear(page, ['list-title', 'lang-en', 'lang-de', 'lang-sv']);

  await page.getByTestId('tab-favorites').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  await allClear(page, ['list-title', 'lang-en']);

  await page.getByTestId('tab-guide').click();
  await expect(page.locator('body[data-screen="guide"]')).toBeAttached();
  await allClear(page, ['guide-title']);

  await page.getByTestId('tab-settings').click();
  await expect(page.locator('body[data-screen="settings"]')).toBeAttached();
  await allClear(page, ['settings-title']);

  // Add a word with a tall screenshot: the edit screen, the word's page and the
  // full-screen photo all start under the clock too.
  await page.getByTestId('tab-words').click();
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await allClear(page, ['edit-cancel', 'edit-title']);
  await page.getByTestId('f-term').fill(`Clock ${Date.now()}`);
  await page.getByTestId('f-en').fill('A word to check the space under the clock.');
  await page.getByTestId('f-photo').setInputFiles([{ name: 'tall.png', mimeType: 'image/png', buffer: makePng(60, 1300) }]);
  await expect(page.getByTestId('f-photo-thumb')).toHaveCount(1);
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await allClear(page, ['detail-back', 'detail-term', 'detail-star']);

  await page.getByTestId('detail-photo').click();
  await expect(page.getByTestId('lightbox')).toBeVisible();
  await allClear(page, ['lightbox-img']);
  await page.getByTestId('lightbox').click();
  await expect(page.getByTestId('lightbox')).toBeHidden();

  // No inset (no clock strip, e.g. the Mac): the top bar stays where it always was.
  await insets(page, 0, 0);
  await page.reload();
  await expect(page.locator('html[data-ready="1"]')).toBeAttached({ timeout: 20_000 });
  expect(await topOf(page, 'list-title')).toBeLessThan(30);
  expect(await topOf(page, 'lang-en')).toBeLessThan(30);
});
