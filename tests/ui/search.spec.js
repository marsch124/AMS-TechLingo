// Test 6: search puts the word itself first — then words whose definition uses
// it as a whole word — then the rest. The alphabet must not decide that
// "Checkbox" beats "Switch" for the search "switch".
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

// Writes a word and returns its id (read off its own page), then goes back.
async function writeWord(page, term, definition) {
  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill(definition);
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();
  const id = await page.locator('#view-detail').getAttribute('data-id');
  await page.getByTestId('detail-back').click();
  await expect(page.locator('body[data-screen="list"]')).toBeAttached();
  return id;
}

test('search puts the word itself first, then whole-word uses, then the rest', async ({ page }) => {
  await openApp(page);
  const stamp = Date.now();
  const needle = `qxz${stamp}`;

  // Named so that A–Z would put them in exactly the WRONG order.
  const partial = await writeWord(page, `Aaa ${stamp}`, `Something about ${needle}ing all day.`);   // merely contains it
  const whole   = await writeWord(page, `Bbb ${stamp}`, `A thing you ${needle} on and off.`);       // uses it as a word
  const itself  = await writeWord(page, `Qxz${stamp}`, 'The word itself.');                         // IS it

  await page.getByTestId('search-input').fill(needle);
  await expect(page.getByTestId('count-line')).toHaveAttribute('data-count', '3');
  const cards = page.getByTestId('entry-card');
  await expect(cards.nth(0)).toHaveAttribute('data-id', itself);
  await expect(cards.nth(1)).toHaveAttribute('data-id', whole);
  await expect(cards.nth(2)).toHaveAttribute('data-id', partial);
});
