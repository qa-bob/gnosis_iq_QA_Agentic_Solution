---
name: Bug Report — Failing Test
about: Report a test that is failing unexpectedly
title: '[BUG] <test name> failing on <browser/viewport>'
labels: bug, test-failure
assignees: ''
---

## Test Details

- **Test name:** 
- **Test file:** `tests/<suite>/<file>.spec.ts`
- **Tag:** `@smoke` / `@navigation` / `@forms` / `@functional` / `@visual` / `@responsive`
- **Browser / project:** chromium-desktop / mobile-chrome / tablet

## Error Message

```
Paste the full error message here.
```

## Steps to Reproduce

```bash
npx playwright test --grep "test name here" --project chromium-desktop
```

## Expected Behavior

What should the test do?

## Actual Behavior

What does the test actually do?

## Site Change?

- [ ] Yes — the site content or structure changed (selector broke, element moved)
- [ ] No — site unchanged, test broken by a code change

**If yes, describe what changed on the site:**

## Environment

- OS: 
- Node.js version: 
- Playwright version: `npx playwright --version`
- Branch: 

## Suggested Fix

If you have an idea for the fix:
