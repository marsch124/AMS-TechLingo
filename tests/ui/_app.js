// Shared helpers. Controls are found by data-testid ONLY, never by the words on
// them — so wording can change freely and a test only fails when something has
// actually stopped working.
import { expect } from '@playwright/test';

// Open the app fresh and wait until it has really started: the database read,
// the list drawn (the app writes html[data-ready] only after both).
export async function openApp(page) {
  await page.goto('/index.html');
  await expect(page.locator('html[data-ready="1"]')).toBeAttached({ timeout: 20_000 });
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
}
