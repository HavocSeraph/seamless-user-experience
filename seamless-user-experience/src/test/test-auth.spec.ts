import { test, expect } from '@playwright/test';

test.use({ headless: false }); // Runs with an external UI (headsful mode)

test.describe('Authentication Workflow visually', () => {

  test('Navigate to app, open Login, and attempt to log in', async ({ page }) => {
    // Open localhost server
    await page.goto('http://localhost:8080/');

    // Attempt to link to Login
    const loginLink = page.locator('text=/Log ?in/i').first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
    } else {
      console.log('Login link not found directly on homepage, proceeding to URL /login directly...');
      await page.goto('http://localhost:8080/login');
    }

    // Attempt to fill out user details if available
    const emailInput = page.locator('input[type="email"], input[name*="email" i]');
    if (await emailInput.count() > 0) {
      await emailInput.first().fill('testuser@example.com');
    }

    const passwordInput = page.locator('input[type="password"]');
    if (await passwordInput.count() > 0) {
      await passwordInput.first().fill('TestPassword123!');
    }

    // Attempt to Sign in
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In")');
    if (await submitBtn.count() > 0) {
      await submitBtn.first().click();
    }

    // Wait a few seconds to visually observe the login step
    await page.waitForTimeout(3000);
  });
});
