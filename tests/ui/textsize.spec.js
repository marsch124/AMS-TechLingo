// Test 9: the type follows the phone's text-size setting. On an iPhone the root
// size comes from the system setting; everything else must be measured from
// that root — so growing the root grows a word, a title and a button alike,
// while a field you type into never drops under 16px (iOS would zoom in on it).
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

const sizeOf = (page, selector) =>
  page.locator(selector).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

test('the type follows the root text size', async ({ page }) => {
  await openApp(page);
  const term16 = await sizeOf(page, '.entry-term');
  const title16 = await sizeOf(page, '[data-testid="list-title"]');

  await page.evaluate(() => { document.documentElement.style.fontSize = '24px'; });
  expect(await sizeOf(page, '.entry-term'), 'a word grows with the root').toBeCloseTo(term16 * 1.5, 1);
  expect(await sizeOf(page, '[data-testid="list-title"]'), 'the title grows with the root').toBeCloseTo(title16 * 1.5, 1);
  expect(await sizeOf(page, '.chip'), 'buttons are measured from the root too').toBeCloseTo(24 * 0.875, 1);

  await page.evaluate(() => { document.documentElement.style.fontSize = '12px'; });
  expect(await sizeOf(page, '[data-testid="search-input"]'), 'a typing field never drops under 16px').toBeGreaterThanOrEqual(16);
  expect(await sizeOf(page, '.entry-term'), 'but ordinary text does shrink').toBeLessThan(14);
});
