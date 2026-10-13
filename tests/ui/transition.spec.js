// Test 26: screens slide — a word's page comes in from the right, Back goes the
// other way, and nothing moves when the phone is set to reduce motion.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('a word slides in, Back slides out, and reduced motion stays still', async ({ page }) => {
  // Stand in for the browser's slide: note the direction asked for, do the swap at once.
  await page.addInitScript(() => {
    window.__slides = [];
    document.startViewTransition = (swap) => {
      window.__slides.push(document.documentElement.dataset.nav);
      swap();
      return { finished: Promise.resolve(), ready: Promise.resolve(), updateCallbackDone: Promise.resolve() };
    };
  });
  await openApp(page);
  const cards = page.getByTestId('entry-card');
  await cards.nth(0).click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  expect(await page.evaluate(() => window.__slides)).toEqual(['forward', 'back']);

  // Reduced motion: the same moves, no slide asked for.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await cards.nth(1).click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  expect(await page.evaluate(() => window.__slides)).toEqual(['forward', 'back']);
});
