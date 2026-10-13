// Test 13: a word you searched for and do not have is one tap from being added —
// the empty search result offers to add it, with the name already filled in.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('an empty search offers to add that word, pre-filled', async ({ page }) => {
  await openApp(page);
  const term = `Unheardof ${Date.now()}`;
  await page.getByTestId('search-input').fill(term);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '0');
  await expect(page.getByTestId('empty-add')).toBeVisible();

  await page.getByTestId('empty-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('f-term')).toHaveValue(term);
  await page.getByTestId('f-en').fill('Now it exists.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.getByTestId('detail-term')).toHaveText(term);

  // Back in the list the same search now finds it — and the offer is gone.
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');
  await expect(page.getByTestId('empty-add')).toHaveCount(0);
});
