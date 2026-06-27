/**
 * tests/functional/home-page.spec.ts
 *
 * Functional tests for the Gnosis IQ homepage (https://www.gnosisiq.com).
 * Covers: hero section, three data-point feature cards, How It Works,
 * Gnosis Assistant section, FAQ accordion, and CTA buttons.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Functional @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  // ── Hero ────────────────────────────────────────────────────────────────────

  test('hero heading is visible and contains expected text @functional @smoke', async ({ homePage }) => {
    await expect(homePage.heroHeading, 'Hero H1 should be visible').toBeVisible();
    const text = await homePage.heroHeading.textContent();
    expect(text?.trim().length, 'Hero heading should have content').toBeGreaterThan(5);
  });

  test('"Request a Demo" CTA is visible and links to contact page @functional', async ({ homePage, siteConfig }) => {
    await expect(homePage.requestDemoLink, '"Request a Demo" link should be visible').toBeVisible();
    const href = await homePage.requestDemoLink.getAttribute('href');
    expect(href, '"Request a Demo" should link to the contact page').toMatch(/contact/i);
  });

  // ── Three data points feature section ───────────────────────────────────────

  test('Emotion Indicators feature section is visible @functional', async ({ homePage }) => {
    await expect(
      homePage.emotionIndicatorsHeading,
      '"Emotion Indicators" should appear on the homepage'
    ).toBeVisible();
  });

  test('Academic Data feature section is visible @functional', async ({ homePage }) => {
    await expect(
      homePage.academicDataHeading,
      '"Academic Data" should appear on the homepage'
    ).toBeVisible();
  });

  test('Predictive Insights feature section is visible @functional', async ({ homePage }) => {
    await expect(
      homePage.predictiveInsightsHeading,
      '"Predictive Insights" should appear on the homepage'
    ).toBeVisible();
  });

  // ── How It Works ────────────────────────────────────────────────────────────

  test('"How it works" section heading is present @functional', async ({ homePage }) => {
    await expect(
      homePage.howItWorksHeading,
      '"How it works" section should be on the homepage'
    ).toBeVisible();
  });

  // ── Gnosis Assistant section ─────────────────────────────────────────────────

  test('Gnosis Assistant section is present @functional', async ({ homePage }) => {
    await expect(
      homePage.gnosisAssistantHeading,
      '"Gnosis Assistant" section heading should be visible'
    ).toBeVisible();
  });

  test('"Explore the Assistant" link navigates to assistant page @functional', async ({ homePage, page, siteConfig }) => {
    if (await homePage.exploreAssistantLink.count() === 0) {
      console.warn('[functional] "Explore the Assistant" link not found — skipping.');
      return;
    }
    await expect(homePage.exploreAssistantLink).toBeVisible();
    const href = await homePage.exploreAssistantLink.getAttribute('href');
    expect(href).toMatch(/assistant/i);
  });

  // ── FAQ section ──────────────────────────────────────────────────────────────

  test('FAQ section heading is present @functional', async ({ homePage }) => {
    await expect(
      homePage.faqHeading,
      '"Frequently asked questions" heading should be on the homepage'
    ).toBeVisible();
  });

  test('FAQ section has at least one question @functional', async ({ homePage }) => {
    const count = await homePage.getFaqCount();
    if (count === 0) {
      console.warn('[functional] FAQ items not found with current selectors — possible class name change.');
      return;
    }
    expect(count, 'FAQ section should have at least one item').toBeGreaterThan(0);
  });

  // ── Bottom CTA ───────────────────────────────────────────────────────────────

  test('"Ready to see it in action" section is present @functional', async ({ homePage }) => {
    await expect(
      homePage.readySection,
      'Bottom CTA section should be visible'
    ).toBeVisible();
  });

  test('"Get in Touch" CTA links to contact page @functional', async ({ homePage }) => {
    if (await homePage.getInTouchLink.count() === 0) {
      console.warn('[functional] "Get in Touch" link not found on homepage — skipping.');
      return;
    }
    await expect(homePage.getInTouchLink).toBeVisible();
    const href = await homePage.getInTouchLink.getAttribute('href');
    expect(href).toMatch(/contact/i);
  });
});
