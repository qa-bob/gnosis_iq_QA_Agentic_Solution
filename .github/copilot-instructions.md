# GitHub Copilot Instructions — Gnosis IQ QA Suite

This file provides context for GitHub Copilot when working in this repository. For AI agents that read `AGENTS.md`, see that file instead.

---

## What This Repo Does

Playwright + TypeScript regression tests for [Gnosis IQ](https://www.gnosisiq.com/), a student body analytics platform. Tests cover smoke, navigation, forms, functional, visual, and responsive scenarios.

**Key constraint:** Never submit forms, create accounts, or enter credentials.

---

## Architecture

- **Pattern:** Page Object Model (POM) — every page is a class in `src/pages/`
- **Base class:** All page classes extend `BasePage` from `src/pages/base.page.ts`
- **Fixtures:** Tests use `import { test, expect } from '@fixtures/site.fixture'`
- **Config:** `site.config.json` holds the target URL and flags — never hardcode URLs

---

## Code Patterns to Use

### Page Object class

```typescript
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class MyPage extends BasePage {
  readonly myLocator: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.myLocator = page.getByRole('heading', { name: /my heading/i });
  }

  async navigateToPage(): Promise<void> {
    await this.page.goto('/my-page', { waitUntil: 'domcontentloaded' });
  }
}
```

### Test file

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('My Feature @functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-page', { waitUntil: 'domcontentloaded' });
  });

  test('feature is visible @functional', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /my heading/i })).toBeVisible();
  });
});
```

---

## Rules

1. No `expect()` in page object classes
2. No `page.waitForTimeout()` — use Playwright auto-waiting
3. No hardcoded base URLs — use `siteConfig.url`
4. No `any` type without explicit comment explaining why
5. All tests tagged with at least one of: `@smoke @navigation @forms @functional @visual @responsive`
6. TypeScript strict mode is on — type all properties

---

## Site Structure (Gnosis IQ)

| Page | Path |
|------|------|
| Homepage | `/` |
| Auto-Rostering | `/auto-rostering` |
| Gnosis Assistant | `/assistant` |
| Integrations | `/integrations` |
| About | `/about` |
| Contact | `/contact` |

**Key elements:** H1 "Understand how your students are really doing", CTA "Request a Demo" → `/contact`, FAQ section, Gnosis Assistant section.

---

## npm Scripts

```bash
npm test                 # All tests
npm run test:smoke       # @smoke only
npm run test:functional  # @functional only
npm run typecheck        # TypeScript check (must pass before PR)
npm run lint             # ESLint (must pass before PR)
```
