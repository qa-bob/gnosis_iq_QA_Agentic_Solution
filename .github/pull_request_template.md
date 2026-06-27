## Summary

<!-- What does this PR do? 1-3 bullet points. -->

- 
- 

## Test Coverage

<!-- What tests are added or modified? -->

| Suite | Files changed | Tags used |
|-------|--------------|-----------|
| | | |

## Checklist

### Code Quality
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] No `any` types introduced without justification

### Architecture
- [ ] New selectors are in page object classes (`src/pages/`), not in spec files
- [ ] Every new page has a class that extends `BasePage`
- [ ] No `page.waitForTimeout()` used
- [ ] No hardcoded `baseURL` in tests

### Test Rules
- [ ] Every test is tagged (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`)
- [ ] No form submissions
- [ ] No account creation or credential entry
- [ ] Tests are independent (no shared state between tests)

### Visual Baselines (if visual tests changed)
- [ ] Baselines updated with `npm run baseline`
- [ ] New baseline screenshots reviewed visually before committing

### CI
- [ ] All CI checks pass
- [ ] Smoke tests pass on the target URL

## Related Issues

<!-- Closes #XX or N/A -->

## Notes for Reviewer

<!-- Anything the reviewer should pay special attention to. -->
