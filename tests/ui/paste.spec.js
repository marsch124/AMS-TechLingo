// Test 11: Paste puts what was last copied into the word field, and into the
// search box — the fastest way a word gets from a mail into the dictionary.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('Paste fills the word field and the search box with what was copied', async ({ page }) => {
  // Stand in for the phone's clipboard (the real one is read-only to scripts).
  await page.addInitScript(() => {
    window.__clip = '';
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { readText: async () => window.__clip } });
  });
  await openApp(page);
  const term = `Pastable ${Date.now()}`;
  await page.evaluate((t) => { window.__clip = t + '\nand a second line that is not the word'; }, term);

  // Into the word field.
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term-paste').click();
  await expect(page.locator('body[data-paste="term"]')).toBeAttached();
  await expect(page.getByTestId('f-term')).toHaveValue(term);
  await page.getByTestId('f-en').fill('Came in through Paste.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const id = await page.locator('#view-detail').getAttribute('data-id');
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();

  // Into the search box — and the search runs.
  await page.getByTestId('search-paste').click();
  await expect(page.locator('body[data-paste="search"]')).toBeAttached();
  await expect(page.getByTestId('search-input')).toHaveValue(term);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');
  await expect(page.getByTestId('entry-card').first()).toHaveAttribute('data-id', id);
});
