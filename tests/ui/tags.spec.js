// Test 32: free tags — typed on one word, offered as chips on the next, shown
// on the word's page, filtering the list by one tag.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

async function writeWord(page, term, tags) {
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('Tagged.');
  if (tags) await page.getByTestId('f-tags').fill(tags);
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const id = await page.locator('#view-detail').getAttribute('data-id');
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  return id;
}

test('tags are typed, offered, shown and used to filter', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  const start = Number(await page.getByTestId('count-line').getAttribute('data-count'));
  const stamp = Date.now();
  const tagA = `ph${stamp}`, tagB = `ml${stamp}`;
  const a = await writeWord(page, `Tagged A ${stamp}`, `${tagA}, ${tagB}, ${tagB}`);   // a double merges

  // The next word is offered the tags in use; one tap adds one.
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(`Tagged B ${stamp}`);
  await page.getByTestId('f-en').fill('Also tagged.');
  const offer = page.locator(`[data-testid="tag-suggest-chip"][data-tag="${tagB}"]`);
  await expect(offer).toBeVisible();
  await offer.click();
  await expect(page.getByTestId('f-tags')).toHaveValue(tagB);
  await expect(offer, 'an added tag is no longer offered').toHaveCount(0);
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await page.getByTestId('detail-back').click();

  // The tag chips narrow the list: B's tag → both words; A's tag → A alone; again → all.
  // (Wait for the list to settle after the screen change before counting — a count
  // read a moment too early was the one red run this test has had.)
  const all = start + 2;
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', String(all));
  await page.locator(`[data-testid="tag-chip"][data-tag="${tagB}"]`).click();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '2');
  await page.locator(`[data-testid="tag-chip"][data-tag="${tagA}"]`).click();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '1');
  await expect(page.getByTestId('entry-card').first()).toHaveAttribute('data-id', a);
  await page.locator(`[data-testid="tag-chip"][data-tag="${tagA}"]`).click();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', String(all));

  // The word's page shows its tags; one leads back to the list narrowed to it.
  await page.getByTestId('search-input').fill(`Tagged A ${stamp}`);
  await page.getByTestId('entry-card').first().click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  await expect(page.getByTestId('detail-tag')).toHaveCount(2);
  await page.locator(`[data-testid="detail-tag"][data-tag="${tagB}"]`).click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '2');
});
