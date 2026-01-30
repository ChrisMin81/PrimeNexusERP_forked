import { expect, test } from '@playwright/test';

test('loads the application shell', async ({ page }) => {
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForResponse((response) => response.url().includes('main.js') && response.status() === 200);

    await expect(page).toHaveTitle(/Comino/i);
    await expect(page.locator('app-root')).toBeAttached();
});
