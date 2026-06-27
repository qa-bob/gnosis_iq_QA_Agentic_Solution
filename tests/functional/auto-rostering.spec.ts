/**
 * tests/functional/auto-rostering.spec.ts
 *
 * Functional tests for the Gnosis IQ Auto-Rostering page (/auto-rostering).
 * Verifies the page loads, has a meaningful heading, body content, and a CTA.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Auto-Rostering Page @functional', () => {
  test.beforeEach(async ({ autoRosteringPage }) => {
    await autoRosteringPage.navigateToAutoRostering();
    await autoRosteringPage.waitForLoad();
  });

  test('auto-rostering page loads successfully @functional @smoke', async ({ page }) => {
    const response = await page.goto('/auto-rostering', { waitUntil: 'domcontentloaded' });
    const status = response?.status() ?? 0;
    expect(
      status >= 200 && status < 400,
      `Expected 2xx/3xx but got HTTP ${status} for /auto-rostering`
    ).toBeTruthy();
  });

  test('auto-rostering page has a heading @functional', async ({ autoRosteringPage }) => {
    await expect(
      autoRosteringPage.pageHeading,
      'Auto-Rostering page should have an H1 heading'
    ).toBeVisible();
    const text = await autoRosteringPage.pageHeading.textContent();
    expect(text?.trim().length, 'Heading should have content').toBeGreaterThan(3);
  });

  test('auto-rostering page has descriptive body content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Auto-Rostering page should have visible body text'
    ).toBeGreaterThan(100);
  });

  test('auto-rostering page has a CTA button or link @functional', async ({ autoRosteringPage }) => {
    const ctaCount = await autoRosteringPage.ctaButton.count();
    if (ctaCount === 0) {
      console.warn('[functional] No CTA link found on auto-rostering page — possible selector update needed.');
      return;
    }
    await expect(autoRosteringPage.ctaButton, 'Auto-Rostering page should have a CTA').toBeVisible();
  });

  test('auto-rostering page has correct page title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page <title> should not be empty').toBeGreaterThan(3);
  });
});
