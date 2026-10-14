// Test 29: swipe a word to the left and Edit and Delete appear behind it; a
// short swipe snaps back; Delete from the row goes to the bin with an Undo.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

async function writeWord(page, term) {
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('Swipe me.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const id = await page.locator('#view-detail').getAttribute('data-id');
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  return id;
}

// Drag the row sideways by `distance` pixels (negative = to the left).
async function swipe(page, row, distance) {
  const box = await row.boundingBox();
  const x = box.x + box.width * 0.6, y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + distance / 2, y + 1, { steps: 4 });
  await page.mouse.move(x + distance, y + 2, { steps: 4 });
  await page.mouse.up();
}

test('a row swiped to the left shows Edit and Delete', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  const term = `Swipeable ${Date.now()}`;
  const id = await writeWord(page, term);
  await page.getByTestId('search-input').fill(term);
  const row = page.locator(`[data-testid="swipe-row"][data-id="${id}"]`);
  await expect(row).toHaveAttribute('data-open', '0');

  // A short nudge snaps back; a real swipe opens the row.
  await swipe(page, row, -30);
  await expect(row).toHaveAttribute('data-open', '0');
  await swipe(page, row, -150);
  await expect(row).toHaveAttribute('data-open', '1');

  // Edit from the row.
  await row.getByTestId('swipe-edit').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await expect(page.getByTestId('f-term')).toHaveValue(term);
  await page.getByTestId('edit-cancel').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();

  // Delete from the row: gone from the list, with an Undo that brings it back.
  await swipe(page, row, -150);
  await expect(row).toHaveAttribute('data-open', '1');
  await row.getByTestId('swipe-delete').click();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '0');
  await page.getByTestId('toast-action').click();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');
});
