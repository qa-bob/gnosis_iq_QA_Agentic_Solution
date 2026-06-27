---
paths:
  - "tests/**/*.spec.ts"
  - "src/fixtures/**/*.ts"
---

# Playwright Test Rules

## Required imports
Always import from the custom fixture, not from @playwright/test directly:
```typescript
import { test, expect } from '@fixtures/site.fixture';
```

## Test tagging
Every test must include at least one tag in its title string:
- `@smoke` — availability, HTTPS, load time
- `@navigation` — nav links, routing, menus
- `@forms` — form fields, validation
- `@functional` — business features
- `@visual` — screenshot regression
- `@responsive` — viewport layout

## Selector priority (use in this order)
1. `getByRole('button', { name: /text/i })` — accessible, resilient
2. `getByLabel('Field label')` — for form inputs
3. `getByText('Visible text')` — for unique text
4. `getByTestId('data-testid')` — if attribute exists
5. CSS/attribute last resort — only when semantic selectors are unavailable

## Waits
Never use `page.waitForTimeout()`. Use:
- Playwright auto-waiting (default for most actions)
- `page.waitForSelector()`
- `page.waitForURL()`
- `page.waitForLoadState('networkidle')` only when necessary

## URLs
Never hardcode base URLs. Always use:
- `siteConfig.url` from the fixture
- Relative paths with Playwright's `baseURL` from config

## Assertions
- Use `await expect(locator).toBeVisible()` — not `toBeTruthy()`
- Use `await expect(locator).toHaveText()` — not string comparison
- Include meaningful failure messages: `expect(x, 'message').toBe(y)`

## No form submissions
```typescript
// WRONG
await page.click('button[type="submit"]');

// RIGHT — interact with fields only, do not submit
await page.fill('input[name="email"]', 'test@example.com');
await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
```
