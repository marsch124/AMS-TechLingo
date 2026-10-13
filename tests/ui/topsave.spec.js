// Test 15: Cancel and Save at the top of the form, on a bar that stays put while
// the form scrolls — so Save is within reach with the keyboard up.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('the form bar stays put, and its Save and Cancel work', async ({ page }) => {
  await openApp(page);
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  const term = `Topsaved ${Date.now()}`;
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-notes').fill('Typed far down the form.');

  // Scrolled to the bottom of the form, the bar is still at the top of the screen.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const bar = await page.locator('.edit-bar').boundingBox();
  expect(bar.y, 'the bar did not scroll away').toBeGreaterThanOrEqual(0);
  expect(bar.y).toBeLessThan(40);
  await expect(page.getByTestId('edit-save-top')).toBeVisible();

  // Cancel at the top asks before throwing typed text away; keeping it keeps it.
  await page.getByTestId('edit-cancel').click();
  await expect(page.getByTestId('confirm-no')).toBeVisible();
  await page.getByTestId('confirm-no').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('f-term')).toHaveValue(term);

  // Save at the top saves.
  await page.getByTestId('edit-save-top').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.getByTestId('detail-term')).toHaveText(term);
});
