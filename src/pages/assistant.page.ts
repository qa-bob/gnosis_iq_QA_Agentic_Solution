import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class AssistantPage extends BasePage {
  readonly pageHeading: Locator;
  readonly assistantDescription: Locator;
  readonly exploreButton: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.getByRole('heading', { level: 1 }).first();
    this.assistantDescription = page.locator('main p').first();
    this.exploreButton = page.getByRole('link', { name: /explore the assistant/i }).first();
    this.ctaButton = page.getByRole('link', { name: /request a demo|get started|contact/i }).first();
  }

  async navigateToAssistant(): Promise<void> {
    await this.page.goto('/assistant', { waitUntil: 'domcontentloaded' });
  }
}
