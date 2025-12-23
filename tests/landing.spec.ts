import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display the landing page with hero section', async ({ page }) => {
    await page.goto('/');

    // Check main heading
    await expect(page.getByRole('heading', { name: /Stop losing track of your PhD applications/i })).toBeVisible();

    // Check hero description
    await expect(page.getByText(/Manage 15 programs, 40 deadlines/i)).toBeVisible();

    // Check CTA button
    const signUpButton = page.getByRole('link', { name: /Start organizing free/i });
    await expect(signUpButton).toBeVisible();
    await expect(signUpButton).toHaveAttribute('href', '/sign-up');
  });

  test('should display feature showcase sections', async ({ page }) => {
    await page.goto('/');

    // Check feature headings
    await expect(page.getByRole('heading', { name: /Track all deadlines in one place/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Log faculty contacts & responses/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Version control your SOPs/i })).toBeVisible();
  });

  test('should display social proof section', async ({ page }) => {
    await page.goto('/');

    // Check testimonial text
    await expect(page.getByText(/Finally stopped forgetting which professors/i)).toBeVisible();
    await expect(page.getByText(/Used by applicants to MIT, Stanford, Berkeley/i)).toBeVisible();
  });

  test('should navigate to sign-up page when clicking CTA', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: /Start organizing free/i }).click();

    // Should navigate to sign-up page
    await expect(page).toHaveURL(/.*sign-up/);
  });
});

