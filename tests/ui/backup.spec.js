// Test 23: backups — the date of the last one is kept and shown, a quiet nudge
// appears when it has been too long, and Add missing adds only what is missing.
import { test, expect } from '@playwright/test';
import { openApp, restartApp } from './_app.js';

test('the last backup is remembered, nudged for, and Add missing adds only what is missing', async ({ page }) => {
  await page.addInitScript(() => {
    navigator.canShare = () => true;
    navigator.share = async () => {};          // the share sheet, saying yes
  });
  await openApp(page);
  await page.evaluate(() => localStorage.removeItem('tl-backup-later'));

  // No backup yet, nothing to nudge about (fewer than five own words).
  await page.getByTestId('tab-settings').click();
  await expect(page.getByTestId('backup-when')).toHaveAttribute('data-at', '');

  // An export is remembered.
  await page.getByTestId('btn-export').click();
  await expect(page.getByTestId('backup-when')).not.toHaveAttribute('data-at', '');

  // Forty days on: the Words page asks for a backup; Later makes it go.
  await page.evaluate(async () => { await TL_DB.setMeta('lastBackupAt', new Date(Date.now() - 40 * 86400000).toISOString()); });
  await restartApp(page);
  await expect(page.getByTestId('backup-nudge')).toBeVisible();
  await page.getByTestId('backup-nudge-later').click();
  await expect(page.getByTestId('backup-nudge')).toBeHidden();

  // Add missing: one new word is added, an older copy of an existing word is not taken.
  const before = Number(await page.getByTestId('count-line').getAttribute('data-count'));
  const existing = await page.evaluate(async () => (await TL_DB.getAllEntries()).find((e) => e.term === 'Toggle'));
  await page.evaluate((existing) => {
    const now = new Date().toISOString();
    const payload = { app: 'AMS TechLingo', formatVersion: 2, exportedAt: now, entries: [
      { id: 'merge-new-' + Date.now(), term: 'Merged In', category: 'Software & Apps', en: 'Came from the Mac.', de: '', sv: '', notes: '', favorite: false, source: 'own', createdAt: now, updatedAt: now, photos: [] },
      { ...existing, photos: [], en: 'An OLDER definition that must not win.', updatedAt: '2000-01-01T00:00:00.000Z' },
    ] };
    importBackup(new File([JSON.stringify(payload)], 'mac.json', { type: 'application/json' }));
  }, existing);
  await expect(page.locator('#confirm-overlay[data-kind="import-preview"]')).toBeVisible();
  await page.getByTestId('confirm-alt').click();                      // Add missing
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', String(before + 1));
  const toggle = await page.evaluate(async () => (await TL_DB.getAllEntries()).find((e) => e.term === 'Toggle').en);
  expect(toggle).toBe(existing.en);
});
