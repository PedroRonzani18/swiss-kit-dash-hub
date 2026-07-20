---
name: validate-change
description: Validate Swiss Kit changes with repository-native checks and a concrete evidence receipt. Use before claiming implementation completion, when reviewing a diff, or after delivering a card.
---

# Validate Change

Validate independently. Do not fix source code during a validation-only pass.

## Determine the validation surface

1. Read root and applicable nested `AGENTS.md` files.
2. Inspect `git status`, the relevant diff, and the acceptance criteria.
3. Classify the change as documentation/configuration, web, API, contract, Prisma/migration, authentication/authorization, or CI/infrastructure.
4. Preserve unrelated changes and identify generated or ignored artifacts separately.

## Run checks

- Web-only: `pnpm lint:web`, `pnpm typecheck:web`, and `pnpm test:web`; add `pnpm test:web:e2e` for routes, shell, auth, or browser behavior.
- API-only: `pnpm lint:api`, `pnpm typecheck:api`, and `pnpm test:api`.
- Contracts, Prisma, auth, authorization, CI, or cross-workspace: `pnpm lint:ci`, `pnpm typecheck`, `pnpm test:ci`, and `pnpm build:ci`.
- Documentation-only: read changed documentation and verify referenced paths; state that runtime validation was not run.
- Run focused tests while diagnosing when they provide clearer evidence, but do not substitute them for a required root command.

## Inspect integrity

Check the diff for secrets, real environment files, product-specific leakage into Core, silent contract breaks, unjustified dependencies, Prisma schema or migration changes, and documentation drift.

Map every acceptance criterion to code, automated evidence, manual evidence, or an explicit gap.

## Return a validation receipt

```text
Validation
- <command or check>: PASS | FAIL | NOT RUN - <evidence or reason>

Acceptance
- <criterion>: COVERED | GAP - <evidence>

Findings
- <severity and file reference, or "No actionable findings">

Residual risk
- <manual checks, environment limits, or "None known">
```

Treat failing required checks and uncovered acceptance criteria as blockers to completion.
