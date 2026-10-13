// Test 14: Delete is never final at once. It is the last button, it can be
// undone on the spot, the word waits in Settings with a Put back, and only
// after 30 days is it really gone.
import { test, expect } from '@playwright/test';
import { openApp, restartApp, openWord } from './_app.js';

async function writeWord(page, term) {
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('Here today.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  return page.locator('#view-detail').getAttribute('data-id');
}

test('deleting can be undone, and a deleted word waits in Settings', async ({ page }) => {
  await openApp(page);
  const term = `Fleeting ${Date.now()}`;
  const id = await writeWord(page, term);

  // Delete is the last button on the page.
  await expect(page.locator('.detail-actions > :last-child')).toHaveAttribute('data-testid', 'detail-delete');

  // Delete, then Undo on the spot.
  await page.getByTestId('detail-delete').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  await page.getByTestId('search-input').fill(term);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '0');
  await page.getByTestId('toast-action').click();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');

  // Delete again and let it stand: it waits in Settings, and Put back brings it home.
  await openWord(page, term);
  await page.getByTestId('detail-delete').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  await page.getByTestId('tab-settings').click();
  await expect(page.locator('body[data-screen="settings"]')).toBeAttached();
  const row = page.locator(`[data-testid="bin-row"][data-id="${id}"]`);
  await expect(row).toBeVisible();
  await row.getByTestId('bin-restore').click();
  await expect(row).toHaveCount(0);
  await page.getByTestId('tab-words').click();
  await page.getByTestId('search-input').fill(term);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');

  // After 30 days it is gone for good — and not a day sooner.
  await page.evaluate(async () => {
    const mk = (id, days) => ({
      id, term: id, category: 'Software & Apps', en: 'x', de: '', sv: '', notes: '', favorite: false,
      source: 'own', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), photos: [],
      deletedAt: new Date(Date.now() - days * 86400000).toISOString()
    });
    await TL_DB.putEntries([mk('bin-29-days', 29), mk('bin-31-days', 31)]);
  });
  await restartApp(page);
  const left = await page.evaluate(async () => (await TL_DB.getAllEntries()).filter((e) => e.id.startsWith('bin-')).map((e) => e.id));
  expect(left).toEqual(['bin-29-days']);
});
