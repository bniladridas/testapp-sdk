import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';

test.describe('TestApp App', () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post('http://127.0.0.1:3001/api/test/reset');
  });

  test('should load the homepage', async ({ page }) => {
    // First signup
    await page.goto('http://127.0.0.1:5173/signup');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1', { hasText: 'TestAI' })).toBeVisible();

    await expect(page).toHaveTitle(/TestApp/);
    await expect(page.locator('h1', { hasText: 'Test CLI' })).toBeVisible();
  });

  test('should open chat', async ({ page }) => {
    // First signup
    await page.goto('http://127.0.0.1:5173/signup');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page.locator('h1', { hasText: 'TestAI' })).toBeVisible();

    await page.click('button[aria-label="Open Test AI Chat"]');
    await expect(
      page.locator('span.font-semibold', { hasText: 'Test AI' }),
    ).toBeVisible();
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
