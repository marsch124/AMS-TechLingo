// Test 24: the search sits in a bar at the bottom of the Words page, with the
// + button beside it, and never covers the last word.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('the search bar sits at the bottom, with + beside it, clear of the last word', async ({ page }) => {
  await openApp(page);
  const viewport = page.viewportSize();
  const search = await page.getByTestId('search-input').boundingBox();
  const plus = await page.getByTestId('fab-add').boundingBox();
  const tabs = await page.locator('#tab-bar').boundingBox();

  expect(search.y, 'the search is in the bottom part of the screen').toBeGreaterThan(viewport.height * 0.7);
  expect(search.y + search.height, 'and above the tabs').toBeLessThanOrEqual(tabs.y + 1);
  expect(Math.abs((plus.y + plus.height / 2) - (search.y + search.height / 2)), 'the + button sits on the same line').toBeLessThan(12);
  expect(plus.x, 'to the right of the search').toBeGreaterThan(search.x + search.width - 1);

  // It still searches, and the last word is never hidden under it.
  await page.getByTestId('search-input').fill('zzzz-nothing-here');
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '0');
  await page.getByTestId('search-clear').click();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const last = await page.getByTestId('entry-card').last().boundingBox();
  const dock = await page.getByTestId('search-dock').boundingBox();
  expect(last.y + last.height, 'the last word ends above the bar').toBeLessThanOrEqual(dock.y + 1);
});
