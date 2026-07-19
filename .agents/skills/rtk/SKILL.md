---
name: rtk
description: Reduce noisy terminal output selectively in this repository. Use before potentially verbose read-only or validation commands, especially lint, typecheck, tests, builds, git status, and dependency listings.
---

# RTK for Swiss Kit

Use RTK only as an explicit presentation wrapper for routine, verbose, read-only or validation output. It does not replace repository checks.

## Allowed uses

- `rtk git status`
- `rtk pnpm lint:ci`
- `rtk pnpm typecheck`
- `rtk pnpm test:ci`
- `rtk pnpm build:ci`
- `rtk pnpm --filter web test`

Immediately rerun the original command without RTK when it fails, output is incomplete or surprising, diagnosis needs exact evidence, or validation needs raw output.

## Never use RTK for

- Prisma schema, migration, seed, or deployment commands;
- authentication, authorization, environment, or secret-related commands;
- destructive commands, dependency installation, or Git writes;
- `git diff` and code-reading/search commands;
- hooks, initialization, telemetry, or automatic rewriting.
