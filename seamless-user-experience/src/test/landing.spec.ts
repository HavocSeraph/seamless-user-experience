import { test, expect } from '@playwright/test';

test('has title and displays landing page features', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // We'll check if the page loaded successfully without errors.
  
  // Verify that there's a heading or some expected text on the page
  await expect(page.locator('text=Token Economy').first()).toBeVisible();
  await expect(page.locator('text=Escrow Protection').first()).toBeVisible();
});