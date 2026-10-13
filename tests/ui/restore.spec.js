// Test 9: restoring a backup is all-or-nothing. A backup file that cannot be
// written must leave every word exactly as it was — the one failure that would
// otherwise take his whole dictionary with it.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('a backup that cannot be restored leaves every word in place', async ({ page }) => {
  await openApp(page);
  const before = await page.getByTestId('count-line').getAttribute('data-count');
  expect(Number(before)).toBeGreaterThan(100);   // the starter library is there

  // A backup whose words cannot be stored (one has no id), fed through the real import.
  await page.evaluate(() => {
    const payload = { app: 'AMS TechLingo', formatVersion: 2, entries: [{ term: 'No id — cannot be stored' }] };
    importBackup(new File([JSON.stringify(payload)], 'bad.json', { type: 'application/json' }));
  });
  await expect(page.locator('#confirm-overlay[data-kind="import-preview"]')).toBeVisible();
  await page.getByTestId('confirm-yes').click();                   // "Replace" — he goes ahead
  await expect(page.locator('#confirm-overlay[data-kind="import-failed"]')).toBeVisible();
  await page.getByTestId('confirm-yes').click();                   // OK

  // Nothing changed: on screen, and in the store itself.
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', before);
  const stored = await page.evaluate(async () => (await TL_DB.getAllEntries()).length);
  expect(String(stored)).toBe(before);
});
