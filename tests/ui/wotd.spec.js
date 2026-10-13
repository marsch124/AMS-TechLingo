// Test 20: a word of the day — one of his own words, the same all day, a tap
// from opening, and a switch in Settings to hide it.
import { test, expect } from '@playwright/test';
import { openApp, restartApp } from './_app.js';

test('the word of the day is one of his own, stays the same today, and can be hidden', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => localStorage.removeItem('tl-wotd'));
  // Make sure there is at least one own word besides the seeded one.
  await page.getByTestId('fab-add').click();
  await page.getByTestId('f-term').fill(`Daily ${Date.now()}`);
  await page.getByTestId('f-en').fill('One of mine.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('detail-back').click();

  const card = page.getByTestId('wotd');
  await expect(card).toBeVisible();
  const id = await card.getAttribute('data-id');
  const source = await page.evaluate(async (id) => (await TL_DB.getAllEntries()).find((e) => e.id === id).source, id);
  expect(source, 'drawn from his own words').toBe('own');

  // The same word after a restart (it changes once a day, not per visit).
  await restartApp(page);
  await expect(card).toHaveAttribute('data-id', id);

  // A tap opens it.
  await card.click();
  await expect(page.locator('#view-detail')).toHaveAttribute('data-id', id);
  await page.getByTestId('detail-back').click();

  // Settings can hide it.
  await page.getByTestId('tab-settings').click();
  await page.getByTestId('wotd-toggle').uncheck();
  await page.getByTestId('tab-words').click();
  await expect(card).toBeHidden();
});
