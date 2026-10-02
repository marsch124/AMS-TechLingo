// Shared helpers. Controls are found by data-testid ONLY, never by the words on
// them — so wording can change freely and a test only fails when something has
// actually stopped working.
import { expect } from '@playwright/test';

// Open the app fresh and wait until it has really started: the database read,
// the list drawn (the app writes html[data-ready] only after both).
export async function openApp(page) {
  await page.goto('/index.html');
  await settled(page);
}

// A genuine restart. (page.goto to the URL the page is already on can be a
// no-op, and data-ready would still be set from the first load — so reload.)
export async function restartApp(page) {
  await page.reload();
  await settled(page);
}

async function settled(page) {
  await expect(page.locator('html[data-ready="1"]')).toBeAttached({ timeout: 20_000 });
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
}

// Open the word carrying this term, from the list, via the search box.
export async function openWord(page, term) {
  await page.getByTestId('search-input').fill(term);
  await page.locator('[data-testid="entry-card"]').filter({ hasText: term }).click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
}
