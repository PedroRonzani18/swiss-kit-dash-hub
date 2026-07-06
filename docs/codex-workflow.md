# Codex Workflow

## Purpose

This document defines the recommended workflow for using Codex in Swiss Kit.

Codex work should use the lightest safe process.

## Flow selection

Use the direct flow by default:

```text
inspect -> implement -> targeted validation -> review diff -> handoff
```

This is appropriate for explanation, diagnosis, small localized fixes and non-sensitive changes with clear validation.

Use a controlled lightweight flow when the change is medium-sized or needs explicit approval before implementation:

```text
short plan -> human approval -> implementation -> targeted validation -> handoff
```

Use the full `$ship` pipeline only when independent roles materially reduce risk:

```text
Planner -> human approval -> Coder -> Tester -> Reviewer
```

Use the full flow for auth, authorization, access-control, contracts, Prisma schema, migrations, environment validation, CI/deploy, security-sensitive configuration, broad architecture changes or when the user explicitly requests `$ship`.

Use `Coder` for implementation work. Do not create a separate Implementer role.

Every run started through the project skill at `.agents/skills/ship/SKILL.md` uses the full flow and pauses for approval after planning. A trivial, unambiguous change may be handled outside `$ship`, with validation proportional to its scope.

Do not split related micro-refinements into separate runs. Consolidate related visual, copy, spacing, responsive and cleanup adjustments into one scoped request with one validation pass.

## Cost control

Keep Codex runs bounded:

- read each required instruction or source file once unless it changes;
- use `rg` to locate symbols before opening broad file ranges;
- avoid relaying long command output when a summarized `rtk` command is sufficient;
- consolidate related edits into logical patches instead of applying many tiny patches;
- run targeted validation first and avoid repeating full suites after every micro-adjustment;
- pause and report if the run starts requiring repeated inspection, repeated validation or a context-heavy restart.

For `$ship`, the orchestrator should stay state-focused:

- read `state.json` and only the artifact sections needed for the current transition;
- do not redo the Coder, Tester or Reviewer work in the main thread;
- when using subagents, prefer minimal context handoff such as role, run ID, artifact paths, attempt and expected output;
- when the environment supports it, spawn subagents with `fork_turns="none"` and rely on pipeline artifacts as the contract;
- avoid inheriting the full conversation into subagents when the run artifacts already contain the contract;
- wait once per stage with a long timeout instead of polling repeatedly.

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

## Pipeline helper commands

Use deterministic helper scripts for mechanical pipeline operations instead of editing JSON or moving review files manually:

```bash
pnpm pipeline:create-run -- "<request>" [--run-id <run-id>]
pnpm pipeline:set-state -- <run-id> <status> [--attempt 0|1|2] [--verdict "SHIP|NEEDS WORK|BLOCK|null"]
pnpm pipeline:check-run -- <run-id>
pnpm pipeline:archive-review -- <run-id>
```

Responsibilities:

- `pipeline:create-run` validates or generates the run ID, creates the run directory, writes `request.md` and initializes `state.json`.
- `pipeline:set-state` validates status, attempt and verdict values, then updates `state.json` with a fresh `updatedAt`.
- `pipeline:check-run` prints a compact status summary, missing artifacts, whether `spec.md` contains an `OPEN QUESTIONS` marker and the current review verdict.
- `pipeline:archive-review` moves `review.md` to `review-attempt-1.md` and refuses to overwrite an existing archive.

## Hook guardrails

Project hooks live in `.codex/hooks.json`.

The protected-path hook runs before supported tool calls and denies edits that target:

- real `.env*` files, except example/template files;
- `pnpm-lock.yaml`, `bun.lock` and `bun.lockb`;
- `.git/**`;
- existing files under `apps/api/prisma/migrations/**`.

The hook script is `.codex/hooks/protect-paths.mjs`. It is intentionally narrow: it prevents common accidental edits to sensitive files, but it is not a complete enforcement boundary. Codex hook interception is incomplete for some shell paths and non-shell tools, so sensitive changes still require human review and normal git diff inspection.

If hooks are disabled in the active Codex config, enable them outside the repo config and restart Codex. Then inspect and trust the project hook with `/hooks`.

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
