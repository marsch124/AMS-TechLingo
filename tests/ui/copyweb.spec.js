// Test 22: Copy puts the word and its definition on the clipboard; Look up
// opens a web search for the word.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('Copy and Look up work from the definition', async ({ page }) => {
  await page.addInitScript(() => {
    window.__copied = null;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      readText: async () => '', writeText: async (t) => { window.__copied = t; },
    } });
  });
  await openApp(page);
  const term = `Copyable ${Date.now()}`;
  await page.getByTestId('fab-add').click();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('Worth copying.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();

  await page.getByTestId('detail-copy').click();
  await expect(page.locator('body[data-copied="definition"]')).toBeAttached();
  const copied = await page.evaluate(() => window.__copied);
  expect(copied).toContain(term);
  expect(copied).toContain('Worth copying.');

  const web = page.getByTestId('detail-web');
  await expect(web).toHaveAttribute('target', '_blank');
  expect(decodeURIComponent(await web.getAttribute('href'))).toContain(term);
});
