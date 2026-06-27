# AGENTS.md — Gnosis IQ QA Agentic Solution

This file defines the AI agents, their roles, and the repository architecture for any AI coding tool reading this project.

> **Claude Code users:** Claude Code reads `CLAUDE.md`, not this file. This file is the universal agent contract for tools that read `AGENTS.md` (GitHub Copilot, OpenAI Codex, Devin, etc.). See `CLAUDE.md` for Claude-specific instructions.

---

## Repository Purpose

Automated GUI, functional, and regression testing for the **Gnosis IQ** website (`https://www.gnosisiq.com`) using Playwright + TypeScript with a Page Object Model (POM) architecture.

**Core constraint:** Tests must run without creating accounts, submitting forms, or entering real credentials.

---

## Project Architecture

```
Site config:     site.config.json
Framework:       Playwright + TypeScript (strict mode)
Pattern:         Page Object Model (POM) + OOP inheritance
Fixtures:        src/fixtures/site.fixture.ts
Page objects:    src/pages/*.page.ts (all extend BasePage)
Tests:           tests/{smoke,navigation,forms,functional,visual,responsive}/
```

---

## Agent Definitions

### Agent: site-analyzer

**Role:** Crawl a live website and produce a fully-populated `site.config.json`.

**Trigger:** When onboarding a new site, verifying an existing config after redesign, or running `/analyze-site`.

**Capabilities:**
- Navigate URLs with `waitUntil: 'networkidle'`
- Extract nav links, headings, forms, CTA buttons
- Follow redirects and identify canonical URL
- Infer industry from page copy
- Detect auth-gated content

**Step-by-step:**
1. Resolve URL via HEAD request, follow all redirects
2. Navigate with `waitUntil: 'networkidle'`; wait extra 2s for SPAs
3. Dismiss cookie consent banners
4. Extract nav items from `nav a[href]`, `[role="navigation"] a[href]`
5. Find contact forms on current page and `/contact`, `/contact-us`
6. Infer industry from `<h1>`, `<h2>`, `<p>` copy
7. Set `skipVisual: true` only for CSS-animated / randomized content
8. Set `auth.required: true` if page redirected to login URL
9. Validate output against `SiteConfig` TypeScript interface

**Output:** Valid `site.config.json` + issues checklist + confidence rating.

---

### Agent: test-generator

**Role:** Read a populated `site.config.json` and generate site-specific Playwright test files.

**Trigger:** When a site has unique features not covered by generic suites, or when expanding test coverage.

**Capabilities:**
- Parse `site.config.json`
- Generate valid TypeScript Playwright specs
- Use the custom fixture (`import { test, expect } from '@fixtures/site.fixture'`)
- Apply correct `@tag` to all tests
- Follow POM conventions (add selectors to page objects, not specs)

**Rules for generated files:**
1. Import from `@fixtures/site.fixture`, not `@playwright/test`
2. Tag all tests with `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
3. No implicit `any` (TypeScript strict mode)
4. No fixed timeouts > 500ms
5. No form submissions
6. Place new locators in page object classes, not in spec files directly

**Output location:** `tests/functional/<feature>.spec.ts` or `tests/custom/<feature>.spec.ts`

---

### Agent: regression-analyst

**Role:** Analyze test result JSON and produce a prioritized list of regressions with root-cause hypotheses.

**Trigger:** After a test run produces failures; when asked to explain why tests are failing.

**Capabilities:**
- Parse `test-results/results.json`
- Identify failure patterns (selector timeout, navigation error, assertion mismatch)
- Distinguish flaky tests from consistent failures
- Suggest fix strategies with code examples
- Prioritize by severity (smoke failures > functional > visual)

**Step-by-step:**
1. Read `test-results/results.json`
2. Group failures by: tag, browser project, error type
3. For selector timeouts: suggest updated locator strategies
4. For navigation errors: check if site URL changed, inspect redirect chain
5. For assertion mismatches: check if site content changed (may need baseline update)
6. Output a prioritized fix list with code snippets

---

## Coding Rules (all agents must follow)

### Page Objects
- Every page/section has one class in `src/pages/`
- All classes extend `BasePage` from `./base.page.ts`
- Locators: `readonly` Playwright `Locator` properties
- Methods: user actions only — no `expect()` inside page objects

### Tests
- Import: `import { test, expect } from '@fixtures/site.fixture'`
- Tags: at least one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`
- URL source: always `siteConfig.url` — never hardcode base URLs
- No form submissions
- No `page.waitForTimeout()` — use Playwright auto-waiting or `waitForSelector`

### TypeScript
- Strict mode (`tsconfig.json`)
- All properties must be typed
- No `any` without explicit justification

### Quality gates
- `npx tsc --noEmit` must pass before any commit
- `npm run lint` must pass before any commit

---

## Site Reference (Gnosis IQ)

| Property | Value |
|----------|-------|
| URL | `https://www.gnosisiq.com` |
| Title | Gnosis IQ — Predicting Student Outcomes |
| Industry | EdTech / Student Analytics |
| Nav pages | `/`, `/auto-rostering`, `/assistant`, `/integrations`, `/about`, `/contact` |
| Contact form | `/contact` |
| Auth | Not required for public pages |
| CTA | "Request a Demo" → `/contact` |

---

## Do Not

- Submit any form
- Create accounts or authenticate (unless `auth.required: true`)
- Hardcode `baseURL` in tests
- Write `expect()` inside page object methods
- Use `page.waitForTimeout()` for waits > 500ms
- Use `any` type without justification
