import { test, expect } from '@playwright/test';

test.describe('HarpertokenUI App', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(page).toHaveTitle(/HarpertokenUI/);
    await expect(page.locator('text=Harpertoken Together CLI')).toBeVisible();
  });

  test('should show survey modal initially', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await expect(
      page.locator('text=Help us improve HarpertokenUI'),
    ).toBeVisible();
  });

  test('should open chat when survey is dismissed', async ({ page }) => {
    // Mock localStorage to skip survey
    await page.addInitScript(() => {
      window.localStorage.setItem('bratui_survey_done', '1');
    });
    await page.goto('http://localhost:5173');
    await page.click('button[aria-label="Open Brat AI Chat"]');
    await expect(page.locator('text=Brat AI')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('bratui_survey_done', '1');
    });
    await page.goto('http://localhost:5173');
    await page.click('text=Project');
    await expect(page.locator('text=Features')).toBeVisible();
  });
});
