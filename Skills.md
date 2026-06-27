# Skills.md — Claude Code Skills & Slash Commands

This file documents all skills and slash commands available in this repository for Claude Code users.

Skills are defined as markdown files in `.claude/commands/`. Invoke any skill by typing `/skill-name` in a Claude Code session.

---

## Available Skills

### `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Analyze the live Gnosis IQ website and produce a fully-populated `site.config.json`.

**Usage:**
```
/analyze-site
/analyze-site https://www.gnosisiq.com
```

**What it does:**
1. Navigates to the configured URL (or the one provided)
2. Extracts page title, meta description, nav links, forms, CTAs, headings
3. Detects auth-gating, redirect chains, cookie banners
4. Outputs a valid `site.config.json` ready to paste into the repo
5. Reports issues found (missing meta, broken links, no HTTPS, etc.)

**When to use:** When the site has changed structure and `site.config.json` is stale, or when onboarding a new URL.

---

### `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyze the website and generate a complete Page Object Model + test suite.

**Usage:**
```
/generate-full-suite
```

**What it does:**
1. Reads `site.config.json`
2. Fetches the live site to discover pages, features, forms
3. Creates or updates page object classes in `src/pages/`
4. Generates test files in `tests/{smoke,navigation,forms,functional,visual,responsive}/`
5. Runs `npx tsc --noEmit` to verify TypeScript compiles
6. Reports what was created and any issues found

**When to use:** Initial setup of the test suite, or after a major site redesign.

---

### `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Run the smoke test suite and display a clean pass/fail summary.

**Usage:**
```
/run-smoke
```

**What it does:**
1. Runs `npm run test:smoke`
2. Parses `test-results/results.json`
3. Displays a formatted table: test name, status, duration
4. For failures: shows error message and suggested fix
5. Exits with mirror of underlying test exit code

**When to use:** Quick confidence check before a deployment, or after making site/test changes.

---

### `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Capture new visual regression baseline screenshots after intentional design changes.

**Usage:**
```
/update-baseline
```

**What it does:**
1. Runs `npm run baseline` (Playwright `--update-snapshots`)
2. Lists all updated baseline files (diff against git)
3. Reminds you to review screenshots before committing
4. Reports any failures during capture

**When to use:** After deliberate design/content changes that should update the visual baseline. Always review screenshots manually before committing.

---

### `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parse and display a full test results summary.

**Usage:**
```
/generate-report
```

**What it does:**
1. Parses `test-results/results.json`
2. Opens the HTML report (`npm run report`)
3. Displays suite-level pass/fail/flaky counts
4. Lists all failures with error messages and suggested next steps

**When to use:** After any test run to get a structured summary, or when sharing results with the team.

---

## Skill Authoring Guide

To add a new skill, create `.claude/commands/<name>.md`. The filename becomes the slash command: `/name`.

### File format:

```markdown
# /command-name

One-line description of what this skill does.

## Usage

/command-name [optional-args]

## What this command does

Step-by-step numbered list of actions...

## Notes

Edge cases, limitations, or related commands.
```

### Conventions:

- Skill files live in `.claude/commands/` (not `skills/`)
- Filename is kebab-case: `my-skill.md` → `/my-skill`
- Keep instructions specific and action-oriented
- Skills load on demand — put detailed procedures here, not in `CLAUDE.md`
- For path-specific coding rules, use `.claude/rules/*.md` instead

---

## Related Resources

- **[AGENTS.md](./AGENTS.md)** — Agent definitions (site-analyzer, test-generator, regression-analyst)
- **[CLAUDE.md](./CLAUDE.md)** — Full Claude Code project instructions
- **`.claude/rules/`** — Path-scoped rules loaded automatically when working with matching files
- **`.claude/agents/`** — Subagent definitions for specialized tasks
