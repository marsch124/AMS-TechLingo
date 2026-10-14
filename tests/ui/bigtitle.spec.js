// Test 28: the big page title stays at the top and shrinks into a slim bar
// once the page scrolls — and grows back at the top.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

const titleSize = (page) => page.getByTestId('list-title').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

test('the big title shrinks as the page scrolls and stays in view', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });   // no transitions to wait on
  await openApp(page);
  await expect(page.locator('body[data-compact="0"]')).toBeAttached();
  const big = await titleSize(page);

  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(page.locator('body[data-compact="1"]')).toBeAttached();
  const small = await titleSize(page);
  expect(small, 'the title shrank').toBeLessThan(big * 0.8);
  const bar = await page.locator('#view-list .top-bar').boundingBox();
  expect(bar.y, 'and the bar is still at the top of the screen').toBeGreaterThanOrEqual(0);
  expect(bar.y).toBeLessThan(60);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('body[data-compact="0"]')).toBeAttached();
  expect(await titleSize(page), 'and grows back at the top').toBeCloseTo(big, 1);
});
