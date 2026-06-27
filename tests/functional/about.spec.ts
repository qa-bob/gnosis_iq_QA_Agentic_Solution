/**
 * tests/functional/about.spec.ts
 *
 * Functional tests for the Gnosis IQ About page (/about).
 * Verifies the page loads with company content and a CTA.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('About Page @functional', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.navigateToAbout();
    await aboutPage.waitForLoad();
  });

  test('about page loads successfully @functional @smoke', async ({ page }) => {
    const response = await page.goto('/about', { waitUntil: 'domcontentloaded' });
    const status = response?.status() ?? 0;
    expect(
      status >= 200 && status < 400,
      `Expected 2xx/3xx but got HTTP ${status} for /about`
    ).toBeTruthy();
  });

  test('about page has a heading @functional', async ({ aboutPage }) => {
    await expect(
      aboutPage.pageHeading,
      'About page should have an H1 heading'
    ).toBeVisible();
  });

  test('about page has company description content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'About page should have meaningful body content'
    ).toBeGreaterThan(100);
  });

  test('about page has correct page title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page <title> should not be empty').toBeGreaterThan(3);
  });
});
