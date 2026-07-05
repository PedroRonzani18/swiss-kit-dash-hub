# Codex Workflow

## Purpose

This document defines the recommended workflow for using Codex in Swiss Kit.

The canonical flow is:

```text
Planner -> human approval -> Coder -> Tester -> Reviewer
```

Use `Coder` for implementation work. Do not create a separate Implementer role.

Every run started through the project skill at `.agents/skills/ship/SKILL.md` uses the full flow and pauses for approval after planning. A trivial, unambiguous change may be handled outside `$ship`, with validation proportional to its scope.

Start a run with:

```text
$ship start <request> [--run-id <id>]
```

The skill generates `<slug>-YYYYMMDD-HHmmss` when no run ID is provided. After reviewing the spec, approve and continue with:

```text
$ship resume <run-id>
```

Invoking `resume` while the run is `awaiting-approval` is explicit approval of the current spec. It refuses to continue while `spec.md` contains `OPEN QUESTIONS`.

## Planner

The Planner turns a request into a repository-grounded spec.

It reads the root instructions, scoped instructions, relevant docs, current source files and package scripts.

It writes:

```text
.pipeline/runs/<run-id>/request.md
.pipeline/runs/<run-id>/context.md
.pipeline/runs/<run-id>/spec.md
```

The spec should cover objective, scope, likely files, public contracts, acceptance criteria, edge cases, existing patterns, validation commands, risks and open questions. It must also classify the change as small, medium or critical and identify security-sensitive areas.

Planning always stops for explicit human approval. If `spec.md` contains `OPEN QUESTIONS`, resolve them in the spec before approval.

## Coder

The Coder applies an approved spec.

It follows the spec exactly, keeps unrelated files untouched, prefers existing patterns, avoids unjustified dependencies, updates docs when architecture changes and records implementation notes when using pipeline artifacts.

Required pipeline output:

```text
.pipeline/runs/<run-id>/changes.md
```

For a correction cycle, the Coder reads the current review and fixes only findings inside the approved spec. A scope-changing finding returns to the Planner and requires new approval.

## Tester

The Tester runs the narrowest relevant validation first and records all commands, results, omitted checks and remaining risk. It does not fix code or tests.

Required pipeline output:

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

## Reviewer

The Reviewer runs after the Tester and is read-only with respect to implementation, tests and configuration. It may write only its pipeline review artifact.

It checks scope, architecture boundaries, contract compatibility, auth/permission risk, validation quality and template safety. For sensitive changes, it must apply `docs/ai/security.md` and include a security section.

Required pipeline output:

```text
.pipeline/runs/<run-id>/review.md
```

The review ends with exactly one current verdict:

- `VERDICT: SHIP`
- `VERDICT: NEEDS WORK`
- `VERDICT: BLOCK`

`SHIP` hands the diff to a human. `BLOCK` stops immediately. The first `NEEDS WORK` allows one Coder -> Tester -> Reviewer correction cycle. Before the second review, archive the first report as `review-attempt-1.md`. A second `NEEDS WORK` returns control to the human.

## Run state

The orchestrator maintains `.pipeline/runs/<run-id>/state.json`:

```json
{
  "version": 1,
  "runId": "<run-id>",
  "status": "planning",
  "attempt": 0,
  "lastVerdict": null,
  "updatedAt": "<ISO-8601 UTC>"
}
```

Allowed statuses are `planning`, `awaiting-approval`, `implementing`, `testing`, `reviewing`, `needs-work`, `blocked` and `ready-for-human-review`.

Approval starts attempt 1. A correction starts attempt 2. `lastVerdict` is `null`, `SHIP`, `NEEDS WORK` or `BLOCK`.

The `$ship resume <run-id>` command uses this state to continue an interrupted run without duplicating completed attempt sections. Runs in `blocked`, second-attempt `needs-work` or `ready-for-human-review` require human direction and do not resume automatically.

## Pipeline artifact rules

- Use a fresh `.pipeline/runs/<run-id>/` for each task.
- Never reuse files from a previous run.
- Do not hide failed tests.
- Do not mark work complete without validation or a clear reason validation could not run.
- Preserve `changes.md` and `test-results.md` as attempt-labeled histories.
- Keep pipeline files out of production behavior.

## PR handoff checklist

A good PR description should include summary, changed areas, out-of-scope notes, validation performed, validation not performed and follow-up PRs.

For docs-only changes, say that runtime validation was not run if no commands were executed.
