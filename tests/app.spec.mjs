import { test, expect } from '@playwright/test';

test.describe('TestApp App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/TestApp/);
    await expect(page.locator('h1', { hasText: 'TestAI' })).toBeVisible();
    await expect(page.locator('h1', { hasText: 'Test CLI' })).toBeVisible();
  });

  test('should open chat', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('button[aria-label="Open Test AI Chat"]');
    await expect(page.locator('span.font-semibold', { hasText: 'Test AI' })).toBeVisible();
  });
});
