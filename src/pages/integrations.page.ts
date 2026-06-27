import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class IntegrationsPage extends BasePage {
  readonly pageHeading: Locator;
  readonly integrationItems: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.getByRole('heading', { level: 1 }).first();
    this.integrationItems = page.locator(
      '[class*="integration"], [class*="partner"], [class*="logo"], img[alt]'
    );
    this.ctaButton = page.getByRole('link', { name: /request a demo|get started|contact/i }).first();
  }

  async navigateToIntegrations(): Promise<void> {
    await this.page.goto('/integrations', { waitUntil: 'domcontentloaded' });
  }

  async getIntegrationCount(): Promise<number> {
    return this.integrationItems.count();
  }
}
