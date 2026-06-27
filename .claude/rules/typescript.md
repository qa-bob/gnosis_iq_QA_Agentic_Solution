---
paths:
  - "src/**/*.ts"
  - "tests/**/*.ts"
---

# TypeScript Rules

## Strict mode is enabled
All code must compile with `tsc --noEmit` without errors. Zero tolerance for type errors.

## No `any`
Avoid `any` type. If unavoidable, add a comment explaining why:
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raw = response as any; // API returns untyped response from third party
```

## Page object structure
```typescript
// All page classes must follow this pattern
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class MyPage extends BasePage {
  readonly myElement: Locator;  // readonly, typed as Locator

  constructor(page: Page, config: SiteConfig) {
    super(page, config);  // always call super with both args
    this.myElement = page.getByRole('heading', { name: /text/i });
  }

  async myAction(): Promise<void> {  // return Promise<void> for actions
    await this.myElement.click();
  }
}
```

## Async/await
Always use `async/await`. Never mix `.then()` chains with `await`.

## Return types
All public methods must have explicit return types:
```typescript
async getTitle(): Promise<string>
async isVisible(): Promise<boolean>
async getItems(): Promise<string[]>
```

## Path aliases
Use path aliases defined in `tsconfig.json`:
- `@pages/` → `src/pages/`
- `@fixtures/` → `src/fixtures/`
- `@utils/` → `src/utils/`
- `@types/` → `src/types/`
