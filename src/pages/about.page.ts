import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AboutPage extends BasePage {
  readonly pageHeading: Locator;
  readonly companyDescription: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.getByRole('heading', { level: 1 }).first();
    this.companyDescription = page.locator('main p').first();
    this.ctaButton = page.getByRole('link', { name: /request a demo|get started|contact|get in touch/i }).first();
  }

  async navigateToAbout(): Promise<void> {
    await this.page.goto('/about', { waitUntil: 'domcontentloaded' });
  }
}
