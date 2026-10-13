// Test 19: See also — a word's page links to the words its text names, and to
// the words whose text names it.
import { test, expect } from '@playwright/test';
import { openApp, openWord } from './_app.js';

async function writeWord(page, term, en) {
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill(en);
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const id = await page.locator('#view-detail').getAttribute('data-id');
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  return id;
}

test('a word links to the words it names, and to the ones naming it', async ({ page }) => {
  await openApp(page);
  const stamp = Date.now();
  const beta = await writeWord(page, `Zorkbeta ${stamp}`, 'On its own.');
  const alpha = await writeWord(page, `Zorkalpha ${stamp}`, `Works together with Zorkbeta ${stamp}.`);

  // Alpha names Beta: the link is there, and it opens Beta.
  await openWord(page, `Zorkalpha ${stamp}`);
  const toBeta = page.locator(`[data-testid="see-also-chip"][data-id="${beta}"]`);
  await expect(toBeta).toBeVisible();
  await toBeta.click();
  await expect(page.locator('#view-detail')).toHaveAttribute('data-id', beta);

  // Beta says nothing about Alpha, but Alpha names Beta — so Beta links back.
  await expect(page.locator(`[data-testid="see-also-chip"][data-id="${alpha}"]`)).toBeVisible();
});
