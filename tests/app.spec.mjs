import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

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

  test('CLI should show usage when no args provided', async () => {
    const cli = spawn('node', ['cli/index.js'], { cwd: process.cwd() });
    let output = '';

    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.stderr.on('data', (data) => {
      output += data.toString();
    });

    await new Promise((resolve) => {
      cli.on('close', resolve);
    });

    expect(output).toContain('Usage: npm run cli "Your prompt here"');
  });
});
