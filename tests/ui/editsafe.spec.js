// Test 8: typed text is never thrown away under his fingers — not by the
// keyboard's Return key, not by a new version arriving, not by a Cancel tap.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('typed text is never thrown away under his fingers', async ({ page }) => {
  await openApp(page);
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  const term = `Halfway ${Date.now()}`;
  await page.getByTestId('f-term').fill(term);

  // Return in the word field moves on; it does not save a half-written word.
  await page.getByTestId('f-term').press('Enter');
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('f-en')).toBeFocused();

  // A new version arriving now has to wait.
  await page.evaluate(() => navigator.serviceWorker.dispatchEvent(new Event('controllerchange')));
  await expect(page.locator('body[data-update-waiting="1"]')).toBeAttached();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('f-term')).toHaveValue(term);

  // Cancel asks first; keeping the text keeps it.
  await page.getByTestId('edit-cancel2').click();
  await expect(page.getByTestId('confirm-no')).toBeVisible();
  await page.getByTestId('confirm-no').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('f-term')).toHaveValue(term);
});
