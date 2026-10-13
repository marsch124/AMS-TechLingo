// Test 12: a word's page follows the EN / DE / SV switch — the chosen language
// first, the others under it, the switch on the page itself, and the choice
// shared with the list.
import { test, expect } from '@playwright/test';
import { openApp, openWord } from './_app.js';

test("a word's page shows the chosen language first", async ({ page }) => {
  await openApp(page);
  const term = `Zweisprachig ${Date.now()}`;
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('In English.');
  await page.getByTestId('f-de').fill('Auf Deutsch.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();

  // English is chosen: English first, German under it.
  await expect(page.getByTestId('def-main')).toHaveAttribute('data-lang', 'en');
  await expect(page.getByTestId('def-other')).toHaveCount(1);
  await expect(page.getByTestId('def-other')).toHaveAttribute('data-lang', 'de');

  // The switch on the page: German first now, English under it.
  await page.getByTestId('detail-lang-de').click();
  await expect(page.getByTestId('def-main')).toHaveAttribute('data-lang', 'de');
  await expect(page.getByTestId('def-main')).toContainText('Auf Deutsch.');
  await expect(page.getByTestId('def-other')).toHaveAttribute('data-lang', 'en');

  // Swedish, which this word lacks: the page says so and keeps the others.
  await page.getByTestId('detail-lang-sv').click();
  await expect(page.getByTestId('def-main')).toHaveAttribute('data-lang', 'sv');
  await expect(page.getByTestId('def-main')).toHaveAttribute('data-missing', '1');
  await expect(page.getByTestId('def-other')).toHaveCount(2);

  // It is the same choice the list uses.
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  await expect(page.getByTestId('lang-sv')).toHaveClass(/active/);
  await page.getByTestId('lang-de').click();
  await openWord(page, term);
  await expect(page.getByTestId('def-main')).toHaveAttribute('data-lang', 'de');
});
