// Test 18: search forgives — accents do not matter, and a misspelt search
// offers the closest-spelled word, one tap away.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('accents are ignored and a misspelling offers the closest word', async ({ page }) => {
  await openApp(page);

  // A word with an accent, found without one.
  const term = `Lägg ${Date.now()}`;
  await page.getByTestId('fab-add').click();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('Add, in Swedish.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const id = await page.locator('#view-detail').getAttribute('data-id');
  await page.getByTestId('detail-back').click();
  await page.getByTestId('search-input').fill(term.replace('ä', 'a'));
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');
  await expect(page.getByTestId('entry-card').first()).toHaveAttribute('data-id', id);

  // A misspelling of a word that exists: nothing found, but Did you mean offers it.
  const misspelt = term.replace('Lägg', 'Laagg');
  await page.getByTestId('search-input').fill(misspelt);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '0');
  const offer = page.locator(`[data-testid="suggest-chip"][data-id="${id}"]`);
  await expect(offer).toBeVisible();
  await offer.click();
  await expect(page.getByTestId('search-input')).toHaveValue(term);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');
  await expect(page.getByTestId('entry-card').first()).toHaveAttribute('data-id', id);
});
