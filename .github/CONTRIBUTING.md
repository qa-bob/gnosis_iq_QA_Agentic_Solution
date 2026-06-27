# Contributing to Gnosis IQ QA Suite

Thank you for contributing. This guide covers everything you need to write, review, and merge test code for this Playwright + TypeScript automation suite.

---

## Before You Start

1. **Read [README.md](../README.md)** — setup instructions and project structure.
2. **Read [CLAUDE.md](../CLAUDE.md)** — architecture rules that AI and human contributors both follow.
3. **Install dependencies:** `npm install && npx playwright install --with-deps chromium`
4. **Verify your setup:** `npm run test:smoke` — all 5 smoke tests should pass.

---

## Non-Negotiable Rules

These apply to every PR, no exceptions:

| Rule | Detail |
|------|--------|
| No form submissions | Test field interactions only, never submit |
| No hardcoded URLs | Use `siteConfig.url` or Playwright's `baseURL` |
| No `page.waitForTimeout()` | Use Playwright auto-waiting or `waitForSelector` |
| No `any` type | TypeScript strict mode is enabled — type everything |
| No assertions in page objects | `expect()` belongs in test files only |
| Every test is tagged | At least one of: `@smoke @navigation @forms @functional @visual @responsive` |
| POM for every page | Create a page class in `src/pages/` before writing test selectors |

---

## Adding a New Test

### 1. Identify the right test suite

| What are you testing? | Folder | Tag |
|-----------------------|--------|-----|
| Site loads, HTTPS, title | `tests/smoke/` | `@smoke` |
| Nav links, mobile menu | `tests/navigation/` | `@navigation` |
| Form fields, validation | `tests/forms/` | `@forms` |
| Feature pages, CTAs, FAQ | `tests/functional/` | `@functional` |
| Screenshots | `tests/visual/` | `@visual` |
| Layout at different sizes | `tests/responsive/` | `@responsive` |

### 2. Create or update the page object

Add locators and actions to the relevant class in `src/pages/`. If the page doesn't have a class yet, create one extending `BasePage`:

```typescript
// src/pages/assistant.page.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class AssistantPage extends BasePage {
  readonly pageHeading: Locator;
  readonly exploreButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.pageHeading = page.getByRole('heading', { name: /gnosis assistant/i });
    this.exploreButton = page.getByRole('link', { name: /explore the assistant/i });
  }

  async navigateToAssistant(): Promise<void> {
    await this.page.goto('/assistant', { waitUntil: 'domcontentloaded' });
  }
}
```

### 3. Register it in the fixture

Add your new page object to `src/fixtures/site.fixture.ts` so tests can use it.

### 4. Write the test

```typescript
// tests/functional/assistant-page.spec.ts
import { test, expect } from '@fixtures/site.fixture';

test.describe('Assistant Page @functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assistant', { waitUntil: 'domcontentloaded' });
  });

  test('assistant page loads with heading @functional @smoke', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /gnosis assistant/i })).toBeVisible();
  });
});
```

### 5. Run type-check and lint

```bash
npm run typecheck   # must pass with zero errors
npm run lint        # must pass with zero errors
```

### 6. Run the relevant suite

```bash
npm run test:functional
```

---

## Branch & PR Workflow

```bash
# Create a branch
git checkout -b feat/assistant-page-tests

# Make changes, then verify
npm run typecheck && npm run lint && npm run test:smoke

# Push and open a PR
git push -u origin feat/assistant-page-tests
```

**Branch naming:**
- `feat/` — new test coverage
- `fix/` — correcting a broken test or selector
- `test/` — adding tests to an existing suite
- `chore/` — CI, config, tooling changes

**PR requirements:**
- Fill in the PR template completely
- CI must pass (type-check, lint, smoke)
- At least one approving review
- No unresolved comments

---

## Commit Message Format

```
type(scope): short imperative description

Examples:
feat(tests): add integrations page functional tests
fix(pom): update contact form email field locator
chore(ci): increase timeout for slow mobile emulation
test(smoke): add redirect-to-HTTPS assertion
```

Types: `feat`, `fix`, `test`, `chore`, `docs`, `refactor`

---

## Selector Strategy (in priority order)

1. `getByRole()` — most accessible and resilient
2. `getByLabel()` — for form fields
3. `getByText()` — for unique visible text
4. `getByTestId()` — if `data-testid` attributes exist
5. CSS class — last resort, prefer semantic selectors

Avoid: XPath, brittle nth-child selectors, implementation-specific class names.

---

## Updating Visual Baselines

After an intentional UI change:

```bash
npm run baseline                    # Capture new screenshots
git diff __snapshots__/             # Review changed files
# Verify images look correct, then:
git add __snapshots__/
git commit -m "chore(visual): update baselines after homepage redesign"
```

**Never commit baseline screenshots without reviewing them visually first.**

---

## Getting Help

- Check the [README](../README.md) for setup and architecture
- Review existing tests in `tests/` for patterns to follow
- Use Claude Code (`claude`) with `/analyze-site` to inspect the live site
- Open a [GitHub Issue](../issues) for bugs or feature requests
