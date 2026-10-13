// Test 17: the last words opened sit in a Recent row, newest first, one tap from
// opening again — and "clear" empties it.
import { test, expect } from '@playwright/test';
import { openApp, restartApp } from './_app.js';

test('the last words opened are one tap away', async ({ page }) => {
  await openApp(page);
  await page.evaluate(() => localStorage.removeItem('tl-recent'));
  await restartApp(page);
  await expect(page.getByTestId('recent-row')).toBeHidden();

  // Open two words from the list.
  const cards = page.getByTestId('entry-card');
  const firstId = await cards.nth(0).getAttribute('data-id');
  const secondId = await cards.nth(1).getAttribute('data-id');
  await cards.nth(0).click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('detail-back').click();
  await cards.nth(1).click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('detail-back').click();

  // Newest first, and still there after a restart.
  await expect(page.getByTestId('recent-row')).toBeVisible();
  await expect(page.getByTestId('recent-chip').nth(0)).toHaveAttribute('data-id', secondId);
  await expect(page.getByTestId('recent-chip').nth(1)).toHaveAttribute('data-id', firstId);
  await restartApp(page);
  await expect(page.getByTestId('recent-chip').nth(0)).toHaveAttribute('data-id', secondId);

  // One tap opens it again.
  await page.getByTestId('recent-chip').nth(1).click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.locator('#view-detail')).toHaveAttribute('data-id', firstId);
  await page.getByTestId('detail-back').click();

  // clear empties the row.
  await page.getByTestId('recent-clear').click();
  await expect(page.getByTestId('recent-row')).toBeHidden();
});
