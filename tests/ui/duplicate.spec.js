// Test 16: no doubles. While typing, the form says when that name is already in
// the dictionary and offers to open it; saving under an existing name asks the
// same; editing a word under its own name is never a double.
import { test, expect } from '@playwright/test';
import { openApp, openWord } from './_app.js';

test('a word with an existing name is caught, and the existing one opened', async ({ page }) => {
  await openApp(page);
  const term = `Twice ${Date.now()}`;
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await expect(page.getByTestId('dup-hint')).toBeHidden();
  await page.getByTestId('f-en').fill('The first one.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const firstId = await page.locator('#view-detail').getAttribute('data-id');

  // Editing the word under its own name is not a double.
  await page.getByTestId('detail-edit').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('dup-hint')).toBeHidden();
  await page.getByTestId('edit-cancel').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('detail-back').click();

  // Typing the same name again (other case, extra space): the hint, and Open it.
  await page.getByTestId('fab-add').click();
  await page.getByTestId('f-term').fill('  ' + term.toUpperCase());
  await expect(page.getByTestId('dup-hint')).toBeVisible();
  await page.getByTestId('dup-open').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.locator('#view-detail')).toHaveAttribute('data-id', firstId);
  await page.getByTestId('detail-back').click();

  // Saving under the existing name asks; "Open it" opens the existing word; no second word exists.
  await page.getByTestId('fab-add').click();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('A would-be double.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('#confirm-overlay[data-kind="duplicate"]')).toBeVisible();
  await page.getByTestId('confirm-no').click();                       // back to editing
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('f-en')).toHaveValue('A would-be double.');
  await page.getByTestId('edit-save').click();
  await page.getByTestId('confirm-yes').click();                      // Open it
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.locator('#view-detail')).toHaveAttribute('data-id', firstId);
  await page.getByTestId('detail-back').click();
  await page.getByTestId('search-input').fill(term);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');
});
