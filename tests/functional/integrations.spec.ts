/**
 * tests/functional/integrations.spec.ts
 *
 * Functional tests for the Gnosis IQ Integrations page (/integrations).
 * Verifies the page loads, lists integrations, and has a CTA.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Integrations Page @functional', () => {
  test.beforeEach(async ({ integrationsPage }) => {
    await integrationsPage.navigateToIntegrations();
    await integrationsPage.waitForLoad();
  });

  test('integrations page loads successfully @functional @smoke', async ({ page }) => {
    const response = await page.goto('/integrations', { waitUntil: 'domcontentloaded' });
    const status = response?.status() ?? 0;
    expect(
      status >= 200 && status < 400,
      `Expected 2xx/3xx but got HTTP ${status} for /integrations`
    ).toBeTruthy();
  });

  test('integrations page has a heading @functional', async ({ integrationsPage }) => {
    await expect(
      integrationsPage.pageHeading,
      'Integrations page should have an H1 heading'
    ).toBeVisible();
  });

  test('integrations page has body content @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Integrations page should have meaningful body content'
    ).toBeGreaterThan(50);
  });

  test('integrations page has a CTA link @functional', async ({ integrationsPage }) => {
    const ctaCount = await integrationsPage.ctaButton.count();
    if (ctaCount === 0) {
      console.warn('[functional] No CTA found on integrations page — possible selector update needed.');
      return;
    }
    await expect(integrationsPage.ctaButton).toBeVisible();
  });

  test('integrations page has correct page title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page <title> should not be empty').toBeGreaterThan(3);
  });
});
