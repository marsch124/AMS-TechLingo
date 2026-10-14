// Test 30: a daily review of five words — word first, definition on tap, then
// Knew it / Show again soon; the ones to see again come first next time.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('a daily review of five words, the missed ones first next time', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openApp(page);
  const card = page.getByTestId('review-card');
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute('data-done', '0');

  await page.getByTestId('review-start').click();
  await expect(page.locator('body[data-screen="review"]')).toBeAttached();
  const again = [];
  for (let i = 0; i < 5; i++) {
    await expect(page.getByTestId('review-count')).toHaveAttribute('data-index', String(i + 1));
    await expect(page.getByTestId('review-count')).toHaveAttribute('data-total', '5');
    await expect(page.getByTestId('review-def'), 'the definition waits for a tap').toBeHidden();
    await page.getByTestId('review-reveal').click();
    await expect(page.getByTestId('review-def')).toBeVisible();
    const id = await page.getByTestId('review-question').getAttribute('data-id');
    if (i % 2 === 0) await page.getByTestId('review-knew').click();
    else { again.push(id); await page.getByTestId('review-again').click(); }
  }
  await expect(page.getByTestId('review-summary')).toHaveAttribute('data-known', '3');
  await expect(page.getByTestId('review-summary')).toHaveAttribute('data-again', '2');
  await page.getByTestId('review-done').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  await expect(card).toHaveAttribute('data-done', '1');

  // Next time, the two to see again come first.
  await page.getByTestId('review-start').click();
  await expect(page.locator('body[data-screen="review"]')).toBeAttached();
  const first = await page.getByTestId('review-question').getAttribute('data-id');
  expect(again, 'a missed word comes first').toContain(first);
  await page.getByTestId('review-reveal').click();
  await page.getByTestId('review-knew').click();
  const second = await page.getByTestId('review-question').getAttribute('data-id');
  expect(again, 'and the other missed one second').toContain(second);
});
