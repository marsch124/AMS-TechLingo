// Test 27: everything a finger taps is at least Apple's 44 points.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

const MIN = 44;
async function atLeast(page, locator, what, { width = false } = {}) {
  const box = await locator.boundingBox();
  expect(box, what + ' is on screen').not.toBeNull();
  expect(box.height, what + ' is tall enough').toBeGreaterThanOrEqual(MIN - 0.5);
  if (width) expect(box.width, what + ' is wide enough').toBeGreaterThanOrEqual(MIN - 0.5);
}

test('every tap target is at least 44 points', async ({ page }) => {
  await openApp(page);
  await atLeast(page, page.getByTestId('lang-en'), 'the language switch');
  await atLeast(page, page.locator('#category-chips .chip').first(), 'a category chip');
  await atLeast(page, page.getByTestId('chip-mine'), 'a filter chip');
  await atLeast(page, page.getByTestId('sort-select'), 'the sort choice');
  await atLeast(page, page.getByTestId('search-paste'), 'paste in the search', { width: true });
  await atLeast(page, page.locator('.entry-card .star-btn').first(), 'a star in the list', { width: true });
  await atLeast(page, page.getByTestId('fab-add'), 'the + button', { width: true });

  await page.getByTestId('entry-card').first().click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await atLeast(page, page.getByTestId('detail-back'), 'the back arrow', { width: true });
  await atLeast(page, page.getByTestId('detail-star'), 'the star on a word', { width: true });
  await atLeast(page, page.getByTestId('detail-lang-en'), 'the switch on a word');
  await atLeast(page, page.getByTestId('detail-listen'), 'Listen');
  await atLeast(page, page.getByTestId('detail-web'), 'Look up');
});
