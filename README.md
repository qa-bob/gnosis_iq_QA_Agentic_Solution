# Gnosis IQ — QA Agentic Solution

Playwright + TypeScript regression test suite for [Gnosis IQ](https://www.gnosisiq.com/) — a student body analytics platform. Built with the Page Object Model (POM) design pattern and structured for agentic execution via Claude Code.

---

## Table of Contents

- [Purpose](#purpose)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Architecture: POM + OOP](#architecture-pom--oop)
- [Contributor Rules](#contributor-rules)
- [Agents, Skills & Rules](#agents-skills--rules)
- [CI/CD](#cicd)

---

## Purpose

This repository automates GUI, functional, and regression testing for **Gnosis IQ's** marketing and product website at `https://www.gnosisiq.com`. Tests cover:

- Site availability and performance (smoke)
- Navigation structure and link health
- Contact form field interactions and validation
- Core feature pages: Auto-Rostering, Gnosis Assistant, Integrations
- Responsive layout at desktop / tablet / mobile viewports
- Visual regression baselines for UI consistency

Tests are written to run **without creating an account or submitting forms**.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation |
| TypeScript | ^5.4 | Strict typing throughout |
| Node.js | 18+ | Runtime |
| ESLint | ^8.57 | Linting |
| GitHub Actions | — | CI/CD pipeline |
| Claude Code | Latest | AI-assisted test authoring & maintenance |

---

## Prerequisites

- **Node.js 18+** — [download](https://nodejs.org/)
- **Git** — [download](https://git-scm.com/)
- **Claude Code CLI** (optional, for AI-assisted workflows) — `npm install -g @anthropic-ai/claude-code`

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/<org>/gnosis_iq_QA_Agentic_Solution.git
cd gnosis_iq_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps chromium

# 4. (Optional) Copy environment file
cp .env.example .env

# 5. Run the smoke suite to confirm setup
npm run test:smoke
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SITE_URL` | _(reads site.config.json)_ | Override the target URL |
| `CI` | unset | Set to `true` in CI to enable stricter settings |

### Configuring the Target Site

All site-specific settings live in `site.config.json` at the project root:

```json
{
  "name": "Gnosis IQ",
  "url": "https://www.gnosisiq.com",
  "hasContactForm": true,
  "expectedNavItems": ["Auto-Rostering", "Assistant", "Integrations", "About", "Contact"],
  "viewports": ["desktop", "mobile", "tablet"],
  "skipVisual": false,
  "skipForms": false
}
```

To point the suite at a different environment (staging, preview), set `SITE_URL` or edit `site.config.json`.

---

## Project Structure

```
gnosis_iq_QA_Agentic_Solution/
├── site.config.json              # Target site configuration
├── playwright.config.ts          # Playwright projects (desktop/tablet/mobile)
├── global-setup.ts               # Pre-run reachability check
├── CLAUDE.md                     # Claude Code instructions (agentic rules)
├── AGENTS.md                     # Shared agent definitions (all AI tools)
├── Skills.md                     # Available Claude Code skills / slash commands
│
├── src/
│   ├── pages/                    # Page Object Model classes
│   │   ├── base.page.ts          #   BasePage — shared methods
│   │   ├── home.page.ts          #   HomePage
│   │   ├── navigation.page.ts    #   NavigationPage
│   │   ├── contact.page.ts       #   ContactFormPage
│   │   ├── auto-rostering.page.ts#   AutoRosteringPage
│   │   ├── assistant.page.ts     #   AssistantPage
│   │   └── integrations.page.ts  #   IntegrationsPage
│   ├── fixtures/
│   │   └── site.fixture.ts       # Custom Playwright fixtures
│   ├── utils/
│   │   ├── link-checker.ts       # HTTP link health checks
│   │   └── visual-helper.ts      # Screenshot comparison helpers
│   └── types/
│       └── site-config.types.ts  # TypeScript interfaces
│
├── tests/
│   ├── smoke/                    # @smoke — availability, load time, HTTPS
│   ├── navigation/               # @navigation — nav links, mobile menu
│   ├── forms/                    # @forms — contact form field validation
│   ├── functional/               # @functional — feature-page business logic
│   ├── visual/                   # @visual — screenshot regression
│   └── responsive/               # @responsive — layout at each viewport
│
├── .claude/
│   ├── agents/                   # Claude Code subagent definitions
│   ├── commands/                 # Slash command definitions
│   └── rules/                    # Path-scoped coding rules
│
└── .github/
    ├── workflows/                # CI/CD pipelines
    ├── ISSUE_TEMPLATE/           # Bug report & test request templates
    ├── pull_request_template.md  # PR checklist
    ├── CONTRIBUTING.md           # Contributor guidelines
    └── copilot-instructions.md   # GitHub Copilot context
```

---

## Running Tests

```bash
# Full suite (all tags, all browsers)
npm test

# By tag
npm run test:smoke          # Availability: site up, HTTPS, load time
npm run test:navigation     # Nav links, mobile menu, logo link
npm run test:forms          # Contact form fields and validation
npm run test:visual         # Screenshot regression
npm run test:responsive     # Layout at desktop / tablet / mobile

# Headed mode (see the browser)
npm run test:headed

# Update visual baselines (after intentional design changes)
npm run baseline

# Open the HTML report
npm run report

# Code quality
npm run lint
npm run typecheck
```

### Test Tags

| Tag | When to use |
|-----|-------------|
| `@smoke` | Site loads, title present, HTTPS, no critical JS errors |
| `@navigation` | Nav links, routing, menus, logo link |
| `@forms` | Form fields, validation, accessibility |
| `@functional` | Feature pages: auto-rostering, assistant, integrations, FAQ |
| `@visual` | Screenshot regression with `toHaveScreenshot()` |
| `@responsive` | Viewport-specific layout checks |

---

## Architecture: POM + OOP

### Page Object Model

Every page or major section has its own class in `src/pages/`. Each class:

- Extends `BasePage` from `./base.page.ts`
- Declares locators as `readonly Locator` class properties
- Exposes methods that represent **user actions** (navigate, click, fill)
- Contains **no `expect()` calls** — assertions stay in test files

```typescript
// src/pages/home.page.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';
import type { SiteConfig } from '@types/site-config.types';

export class HomePage extends BasePage {
  readonly heroHeading: Locator;
  readonly requestDemoButton: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroHeading = page.locator('h1').first();
    this.requestDemoButton = page.getByRole('link', { name: /request a demo/i });
  }

  async clickRequestDemo(): Promise<void> {
    await this.requestDemoButton.click();
  }
}
```

### OOP Principles Applied

| Principle | Where applied |
|-----------|--------------|
| **Inheritance** | All page classes extend `BasePage` |
| **Encapsulation** | Locators and actions are private to their page class |
| **Abstraction** | Tests interact with page methods, not raw `page.locator()` |
| **Composition** | Fixtures compose page objects into a unified test context |

### Custom Fixtures

Tests import from `@fixtures/site.fixture` (not directly from `@playwright/test`):

```typescript
import { test, expect } from '@fixtures/site.fixture';

test('home page has hero heading @smoke', async ({ homePage }) => {
  await expect(homePage.heroHeading).toBeVisible();
});
```

Available fixtures: `siteConfig`, `homePage`, `navigationPage`, `contactPage`.

---

## Contributor Rules

### Must Follow

1. **Read `site.config.json` first** before writing any test or selector.
2. **Inspect the live site** with `WebFetch` or a browser before writing selectors — no placeholder locators.
3. **Every page gets a page object** in `src/pages/` — no raw `page.locator()` in test bodies.
4. **Every test is tagged** with at least one of `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`.
5. **Never submit forms** — test field interaction and validation only.
6. **Never hardcode `baseURL`** — use `siteConfig.url` or Playwright's `baseURL`.
7. **No `page.waitForTimeout()`** — use `waitForSelector`, `waitForURL`, or Playwright's auto-waiting.
8. **Run `npm run typecheck`** before opening a PR — zero TypeScript errors required.
9. **Run `npm run lint`** before opening a PR — zero ESLint errors required.

### Branch & PR Flow

```
main (protected)
└── feat/your-feature-branch
    └── → Pull Request → review → merge
```

- Branch naming: `feat/`, `fix/`, `test/`, `chore/`
- PRs require at least one approving review
- CI must pass (type-check, lint, smoke tests) before merge
- Use the PR template in `.github/pull_request_template.md`

### Commit Style

```
type(scope): short description

feat(tests): add auto-rostering page functional tests
fix(pom): correct contact form locator selector
chore(ci): add GitHub Actions smoke test workflow
test(smoke): add HTTPS redirect assertion
```

---

## Agents, Skills & Rules

This repository includes Claude Code agents, skills, and rules for AI-assisted test authoring. See:

- **[AGENTS.md](./AGENTS.md)** — All agent definitions with capabilities and usage
- **[Skills.md](./Skills.md)** — All slash commands and skills
- **[CLAUDE.md](./CLAUDE.md)** — Full Claude Code project instructions
- **`.claude/rules/`** — Path-scoped coding rules loaded automatically

### Quick Reference

| Slash Command | What it does |
|--------------|-------------|
| `/analyze-site` | Inspect live site, update `site.config.json` |
| `/generate-full-suite` | Generate full POM + test suite from site analysis |
| `/run-smoke` | Run smoke tests, show pass/fail summary |
| `/update-baseline` | Refresh visual regression snapshots |
| `/generate-report` | Parse and display full test results summary |

---

## CI/CD

GitHub Actions workflows run on every push and PR:

| Workflow | Trigger | What it runs |
|----------|---------|-------------|
| `playwright.yml` | push / PR | Type-check, lint, smoke + navigation tests |
| `full-regression.yml` | schedule (daily) | Full test suite across all browsers |

Artifacts (HTML report, screenshots, traces) are uploaded and available for 7 days after each run.

---

## License

Internal use. Not for redistribution.

---

*Test suite maintained by the QA Agentic Solutions team. AI-assisted authoring via Claude Code.*
