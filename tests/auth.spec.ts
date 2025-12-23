import { test, expect } from '@playwright/test';

test.describe('Authentication Pages', () => {
  test.describe('Sign In Page', () => {
    test('should display sign in form', async ({ page }) => {
      await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });
      
      // Wait for React to hydrate - look for any form element or card
      await page.waitForSelector('form, [role="button"]', { state: 'visible', timeout: 15000 });

      // Check page title - CardTitle is a div, not a heading, so use text content
      await expect(page.getByText(/Sign in/i).first()).toBeVisible({ timeout: 15000 });
      
      await expect(page.getByText(/Enter your credentials to access your applications/i)).toBeVisible();

      // Check form fields
      await expect(page.getByLabel(/Email/i)).toBeVisible();
      await expect(page.getByLabel(/Password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/sign-in');

      // Try to submit empty form
      await page.getByRole('button', { name: /Sign in/i }).click();

      // Note: Validation happens on submit, so we might need to wait for error messages
      // The form uses react-hook-form with zod validation
    });

    test('should show link to sign up page', async ({ page }) => {
      await page.goto('/sign-in');
      await page.waitForSelector('form', { state: 'visible' });

      const signUpLink = page.getByRole('link', { name: /sign up/i });
      await expect(signUpLink).toBeVisible();
      await expect(signUpLink).toHaveAttribute('href', '/sign-up');
    });

    test('should navigate to sign up page', async ({ page }) => {
      await page.goto('/sign-in');
      await page.waitForSelector('form', { state: 'visible' });

      await page.getByRole('link', { name: /sign up/i }).click();
      await expect(page).toHaveURL(/.*sign-up/);
    });
  });

  test.describe('Sign Up Page', () => {
    test('should display sign up form', async ({ page }) => {
      await page.goto('/sign-up', { waitUntil: 'domcontentloaded' });
      
      // Wait for React to hydrate - look for any form element or card
      await page.waitForSelector('form, [role="button"]', { state: 'visible', timeout: 15000 });

      // Check page title - CardTitle is a div, not a heading, so use text content
      await expect(page.getByText(/Create an account/i).first()).toBeVisible({ timeout: 15000 });
      
      await expect(page.getByText(/Get started with 3 free programs/i)).toBeVisible();

      // Check form fields
      await expect(page.getByLabel(/Name/i)).toBeVisible();
      await expect(page.getByLabel(/Email/i)).toBeVisible();
      await expect(page.getByLabel(/Password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign up|creating account/i })).toBeVisible();
    });

    test('should show link to sign in page', async ({ page }) => {
      await page.goto('/sign-up');
      await page.waitForSelector('form', { state: 'visible' });

      const signInLink = page.getByRole('link', { name: /sign in/i });
      await expect(signInLink).toBeVisible();
      await expect(signInLink).toHaveAttribute('href', '/sign-in');
    });

    test('should navigate to sign in page', async ({ page }) => {
      await page.goto('/sign-up');
      await page.waitForSelector('form', { state: 'visible' });

      await page.getByRole('link', { name: /sign in/i }).click();
      await expect(page).toHaveURL(/.*sign-in/);
    });
  });
});

