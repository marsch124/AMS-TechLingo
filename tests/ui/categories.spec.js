// Test 21: categories can be renamed and merged, and a new category that only
// differs in capitals joins the existing one.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

async function writeWord(page, term, newCategory) {
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-category').selectOption('__new__');
  await page.getByTestId('f-newcat').fill(newCategory);
  await page.getByTestId('f-en').fill('Categorised.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const id = await page.locator('#view-detail').getAttribute('data-id');
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  return id;
}
const categoryOf = (page, id) => page.evaluate(async (id) => (await TL_DB.getAllEntries()).find((e) => e.id === id).category, id);
const row = (page, cat) => page.locator(`[data-testid="cat-row"][data-cat="${cat}"]`);

test('categories can be renamed, merged, and never doubled by capitals', async ({ page }) => {
  await openApp(page);
  const stamp = Date.now();
  const first = await writeWord(page, `Catword A ${stamp}`, `Zebra Tools ${stamp}`);
  // Typed in other capitals: joins the existing category, no second one.
  const second = await writeWord(page, `Catword B ${stamp}`, `zebra TOOLS ${stamp}`);
  expect(await categoryOf(page, second)).toBe(`Zebra Tools ${stamp}`);

  // Rename in Settings: both words follow.
  await page.getByTestId('tab-settings').click();
  await expect(row(page, `Zebra Tools ${stamp}`)).toHaveAttribute('data-count', '2');
  await row(page, `Zebra Tools ${stamp}`).getByTestId('cat-rename').click();
  await expect(page.locator('#confirm-overlay[data-kind="rename-category"]')).toBeVisible();
  await page.getByTestId('confirm-input').fill(`Zebra Kit ${stamp}`);
  await page.getByTestId('confirm-yes').click();
  await expect(row(page, `Zebra Kit ${stamp}`)).toHaveAttribute('data-count', '2');
  await expect(row(page, `Zebra Tools ${stamp}`)).toHaveCount(0);
  expect(await categoryOf(page, first)).toBe(`Zebra Kit ${stamp}`);

  // Rename onto an existing category: asks, then merges.
  await row(page, `Zebra Kit ${stamp}`).getByTestId('cat-rename').click();
  await page.getByTestId('confirm-input').fill('ai');          // "AI" exists in the starter library
  await page.getByTestId('confirm-yes').click();
  await expect(page.locator('#confirm-overlay[data-kind="merge-category"]')).toBeVisible();
  await page.getByTestId('confirm-yes').click();
  await expect(row(page, `Zebra Kit ${stamp}`)).toHaveCount(0);
  expect(await categoryOf(page, first)).toBe('AI');
  expect(await categoryOf(page, second)).toBe('AI');
});
