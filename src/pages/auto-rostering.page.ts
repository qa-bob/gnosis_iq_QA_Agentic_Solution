import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AutoRosteringPage extends BasePage {
  readonly pageHeading: Locator;
  readonly ctaButton: Locator;
  readonly featureDescription: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.getByRole('heading', { level: 1 }).first();
    this.ctaButton = page.getByRole('link', { name: /request a demo|get started|contact|learn more/i }).first();
    this.featureDescription = page.locator('main p').first();
  }

  async navigateToAutoRostering(): Promise<void> {
    await this.page.goto('/auto-rostering', { waitUntil: 'domcontentloaded' });
  }
}
