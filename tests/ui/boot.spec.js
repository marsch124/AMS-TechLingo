// Test 1: the app starts, opens its database and names its version.
import { test, expect } from '@playwright/test';
import { openApp } from './_app.js';

test('the app starts and shows its version', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`${e}`));

  await openApp(page);

  // The version label is EMPTY in the markup; only the code fills it. So seeing
  // the code's own number there proves the app ran — and that the two markers
  // (app and offline worker) have not drifted apart.
  const code = await page.evaluate(() => APP_VERSION);
  expect(code, 'the code names a version').toMatch(/^\d+\.\d+/);
  await page.getByTestId('tab-settings').click();
  await expect(page.locator('body[data-screen="settings"]')).toBeAttached();
  await expect(page.getByTestId('version-label')).toHaveText(code);
  const worker = await (await page.request.get('/sw.js')).text();
  expect(worker, 'the offline worker names the same version').toContain(`APP_VERSION = '${code}'`);

  for (const tab of ['words', 'favorites', 'guide', 'settings']) {
    await expect(page.getByTestId(`tab-${tab}`)).toBeVisible();
  }
  expect(errors, 'starting raised no error').toEqual([]);
});
