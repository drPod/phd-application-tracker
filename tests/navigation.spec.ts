import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between landing and auth pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to sign up
    await page.getByRole('link', { name: /Start organizing free/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
    await page.waitForSelector('form', { state: 'visible' });

    // Navigate to sign in
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/.*sign-in/);
    await page.waitForSelector('form', { state: 'visible' });

    // Navigate back to sign up
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/.*sign-up/);
  });

  test('should have consistent navigation structure', async ({ page }) => {
    // Test that navigation elements are consistent across pages
    await page.goto('/sign-in');
    await page.waitForSelector('form', { state: 'visible' });
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();

    await page.goto('/sign-up');
    await page.waitForSelector('form', { state: 'visible' });
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });
});

