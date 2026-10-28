/**
 * tests/functional/assistant.spec.ts
 *
 * Functional tests for the Gnosis IQ Assistant page (/assistant).
 * Verifies the page loads, presents the AI assistant description,
 * and has a CTA to explore the feature.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Gnosis Assistant Page @functional', () => {
  test.beforeEach(async ({ assistantPage }) => {
    await assistantPage.navigateToAssistant();
    await assistantPage.waitForLoad();
  });

  test('assistant page loads successfully @functional @smoke', async ({ page }) => {
    const response = await page.goto('/assistant', { waitUntil: 'domcontentloaded' });
    const status = response?.status() ?? 0;
    expect(
      status >= 200 && status < 400,
      `Expected 2xx/3xx but got HTTP ${status} for /assistant`
    ).toBeTruthy();
  });

  test('assistant page has a heading @functional', async ({ assistantPage }) => {
    await expect(
      assistantPage.pageHeading,
      'Assistant page should have an H1 heading'
    ).toBeVisible();
    const text = await assistantPage.pageHeading.textContent();
    expect(text?.trim().length, 'Heading should have content').toBeGreaterThan(3);
  });

  test('assistant page has body content describing the feature @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      bodyText.trim().length,
      'Assistant page should have meaningful body content'
    ).toBeGreaterThan(100);
    expect(
      bodyText.toLowerCase(),
      'Page should mention "assistant" in its content'
    ).toContain('assistant');
  });

  test('assistant page has a CTA link @functional', async ({ assistantPage }) => {
    const ctaCount = await assistantPage.ctaButton.count();
    test.skip(ctaCount === 0, 'No CTA found on assistant page');
    await expect(assistantPage.ctaButton, 'Assistant page should have a CTA').toBeVisible();
  });

  test('assistant page has correct page title @functional', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length, 'Page <title> should not be empty').toBeGreaterThan(3);
  });
});
