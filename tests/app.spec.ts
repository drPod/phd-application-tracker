import { test, expect } from '@playwright/test';

test.describe('App Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Note: These tests assume authentication is required
    // In a real scenario, you might need to set up authentication state
    // For now, we'll test that pages redirect or show appropriate states
  });

  test.describe('Programs Page', () => {
    test('should redirect to sign-in when accessing /app without authentication', async ({ page }) => {
      await page.goto('/app');
      
      // The middleware redirects unauthenticated users to /sign-in
      await expect(page).toHaveURL(/.*\/sign-in/);
    });

    test('should redirect to sign-in when accessing /app/programs without authentication', async ({ page }) => {
      await page.goto('/app/programs');
      
      // The middleware redirects unauthenticated users to /sign-in
      await expect(page).toHaveURL(/.*\/sign-in/);
    });
  });

  test.describe('Documents Page', () => {
    test('should redirect to sign-in when accessing /app/documents without authentication', async ({ page }) => {
      await page.goto('/app/documents');
      
      // The middleware redirects unauthenticated users to /sign-in
      await expect(page).toHaveURL(/.*\/sign-in/);
    });
  });
});

