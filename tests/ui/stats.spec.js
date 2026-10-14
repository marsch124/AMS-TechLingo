// Test 31: quiet statistics at the top of the Guide — true to the dictionary,
// and fresh every time the Guide opens.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('the Guide shows live counts of the dictionary', async ({ page }) => {
  await openApp(page);
  const words = Number(await page.getByTestId('count-line').getAttribute('data-count'));
  await page.getByTestId('tab-guide').click();
  await expect(page.locator('body[data-screen="guide"]')).toBeAttached();
  const stats = page.getByTestId('guide-stats');
  await expect(stats).toBeVisible();
  await expect(stats).toHaveAttribute('data-words', String(words));
  const own = Number(await stats.getAttribute('data-own'));

  // One more word of his own: both counts move, next time the Guide opens.
  await page.getByTestId('tab-words').click();
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(`Counted ${Date.now()}`);
  await page.getByTestId('f-en').fill('One more.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('tab-guide').click();
  await expect(page.locator('body[data-screen="guide"]')).toBeAttached();
  await expect(stats).toHaveAttribute('data-words', String(words + 1));
  await expect(stats).toHaveAttribute('data-own', String(own + 1));
});
