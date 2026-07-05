# Codex Workflow

## Purpose

This document defines the recommended workflow for using Codex in Swiss Kit.

The canonical flow is:

```text
Planner -> Coder -> Reviewer -> Tester
```

Use `Coder` for implementation work. Do not create a separate Implementer role.

## Planner

The Planner turns a request into a repository-grounded spec.

It reads the root instructions, scoped instructions, relevant docs, current source files and package scripts.

It writes:

```text
.pipeline/runs/<run-id>/request.md
.pipeline/runs/<run-id>/context.md
.pipeline/runs/<run-id>/spec.md
```

The spec should cover objective, scope, likely files, public contracts, acceptance criteria, edge cases, existing patterns, validation commands, risks and open questions.

If open questions affect auth, permissions, contracts, migrations or public API, planning stops before coding.

## Coder

The Coder applies an approved spec.

It follows the spec exactly, keeps unrelated files untouched, prefers existing patterns, avoids unjustified dependencies, updates docs when architecture changes and records implementation notes when using pipeline artifacts.

Suggested output:

```text
.pipeline/runs/<run-id>/changes.md
```

## Reviewer

The Reviewer is read-only.

It checks scope, architecture boundaries, contract compatibility, auth/permission risk, validation quality and template safety.

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

Validation examples:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
```

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

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

## PR handoff checklist

A good PR description should include summary, changed areas, out-of-scope notes, validation performed, validation not performed and follow-up PRs.

For docs-only changes, say that runtime validation was not run if no commands were executed.
