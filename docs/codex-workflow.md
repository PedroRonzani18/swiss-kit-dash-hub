# Codex Workflow

## Purpose

This document defines the recommended workflow for using Codex in Swiss Kit.

The goal is to reduce drift, avoid oversized changes and make each task easier to review.

## Default flow

Use four roles:

```text
Planner -> Coder -> Reviewer -> Tester
```

For small tasks, one Codex run may perform more than one role, but it should still follow the responsibilities below.

## Planner

The Planner turns a request into a repository-grounded spec.

The Planner reads root `AGENTS.md`, scoped `AGENTS.md` files, relevant docs, current source files and package scripts.

The Planner writes:

```text
.pipeline/runs/<run-id>/request.md
.pipeline/runs/<run-id>/context.md
.pipeline/runs/<run-id>/spec.md
```

The spec must include objective, scope, likely files, public contracts affected, acceptance criteria, edge cases, existing patterns, validation commands, risks and open questions.

If open questions affect auth, permissions, contracts, migrations or public API, the Planner stops before coding.

## Coder

The Coder applies an approved spec.

The Coder must follow the spec exactly, keep unrelated files untouched, prefer existing patterns, avoid unjustified dependencies, update docs when architecture changes and record implementation notes when using pipeline artifacts.

Suggested output:

```text
.pipeline/runs/<run-id>/changes.md
```

## Reviewer

The Reviewer is read-only.

The Reviewer checks scope, architecture boundaries, contract compatibility, auth/permission risk, validation quality and template safety.

Suggested output:

```text
.pipeline/runs/<run-id>/review.md
```

## Tester

The Tester runs relevant validation and records results.

Suggested output:

```text
.pipeline/runs/<run-id>/test-results.md
```

Validation should start narrow and expand when needed.

Frontend examples:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
```

API examples:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

Cross-workspace examples:

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

Never claim a command passed unless it actually ran.

## Pipeline artifact rules

- Use a fresh `.pipeline/runs/<run-id>/` for each task.
- Never reuse files from a previous run.
- Do not hide failed tests.
- Do not mark work complete without validation or a clear reason validation could not run.
- Keep pipeline files out of production behavior.

## Recommended task sizing

Prefer small PRs:

- one architecture/governance change;
- one module scaffold change;
- one access-control step;
- one dependency upgrade;
- one contract migration.

Avoid combining dependency upgrades with architecture refactors.

## PR handoff checklist

A good PR description should include summary, changed areas, out-of-scope notes, validation performed, validation not performed and follow-up PRs.

For docs-only changes, say that runtime validation was not run if no commands were executed.
