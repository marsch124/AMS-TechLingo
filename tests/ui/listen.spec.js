// Test 10: Listen reads the word and its definition aloud in the language the
// switch is on — and in the language the word has, when the chosen one is missing.
import { test, expect } from '@playwright/test';
import { openApp, openWord } from './_app.js';

test('Listen reads the word in the chosen language', async ({ page }) => {
  // Stand in for the phone's voice: record what it is asked to say.
  await page.addInitScript(() => {
    window.__spoken = [];
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    // The browser's own speechSynthesis is a read-only property: define over it.
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      speaking: false, pending: false, cancel() {}, getVoices: () => [],
      speak(u) { window.__spoken.push({ text: u.text, lang: u.lang }); setTimeout(() => u.onend && u.onend(), 5); },
    } });
  });
  await openApp(page);
  const term = `Hörbar ${Date.now()}`;

  await page.getByTestId('fab-add').click();
  await expect(page.locator('body[data-screen="edit"]')).toBeAttached();
  await page.getByTestId('f-term').fill(term);
  await page.getByTestId('f-en').fill('Something you can hear.');
  await page.getByTestId('f-de').fill('Etwas, das man hören kann.');
  await page.getByTestId('edit-save').click();
  await expect(page.locator('body[data-screen="detail"]')).toBeAttached();

  // German is the reading language: the German definition is read, in German.
  await page.getByTestId('detail-back').click();
  await page.getByTestId('lang-de').click();
  await openWord(page, term);
  await page.getByTestId('detail-listen').click();
  await expect(page.locator('body[data-speech="done"]')).toBeAttached();
  let spoken = await page.evaluate(() => window.__spoken);
  expect(spoken).toHaveLength(1);
  expect(spoken[0].lang).toBe('de-DE');
  expect(spoken[0].text).toContain(term);
  expect(spoken[0].text).toContain('Etwas, das man hören kann.');

  // Swedish is chosen but this word has no Swedish: it reads the English, in English.
  await page.getByTestId('detail-back').click();
  await page.getByTestId('lang-sv').click();
  await openWord(page, term);
  await page.getByTestId('detail-listen').click();
  await expect(page.locator('body[data-speech="done"]')).toBeAttached();
  spoken = await page.evaluate(() => window.__spoken);
  expect(spoken).toHaveLength(2);
  expect(spoken[1].lang).toBe('en-US');
  expect(spoken[1].text).toContain('Something you can hear.');
});
