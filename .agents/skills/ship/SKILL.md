---
name: ship
description: Run the controlled Swiss Kit implementation pipeline from repository-grounded planning through human approval, coding, testing, review and human handoff.
argument-hint: "start <request> [--run-id <id>] | resume <run-id>"
disable-model-invocation: true
---

# Swiss Kit Ship

Run the repository's controlled implementation pipeline.

`ship` prepares a change for human review. It never commits, pushes, opens a pull request or merges.

Use this full pipeline only when independent Planner, Coder, Tester and Reviewer roles materially reduce risk. Prefer direct work outside `$ship` for small localized, non-sensitive changes with clear validation.

## Required reading

Before acting:

1. Read the root `AGENTS.md`.
2. Read `docs/codex-workflow.md`.
3. Read `.pipeline/README.md`.
4. Read the scoped instructions and architecture documents required by the task.

Use the project agents in this order:

```text
Planner -> human approval -> Coder -> Tester -> Reviewer
```

Run dependent agents sequentially, never in parallel.

## Cost control

Keep the orchestrator small and state-focused.

- Read each required instruction or artifact once unless it changes.
- Prefer `rg` before opening broad file ranges.
- Prefer summarized `rtk` output for noisy commands.
- Do not redo Coder, Tester or Reviewer work in the main thread.
- Do not repeatedly inspect unchanged files or rerun unchanged validations.
- Consolidate related patches and validation passes by logical unit.
- When using subagents, prefer minimal context handoff: role, run ID, artifact paths, attempt number, constraints and expected output.
- When supported, spawn subagents with `fork_turns="none"` and rely on pipeline artifacts as the contract.
- Avoid inheriting the full conversation into subagents when run artifacts already contain the contract.
- Wait once per stage with a long timeout instead of polling frequently.
- Pause and report if the run becomes a sequence of repeated inspections, repeated validations or context-heavy restarts.

## Commands

### `start <request> [--run-id <id>]`

Start a new pipeline run.

- Require a non-empty request.
- If `--run-id` is present, require it to match `[a-z0-9][a-z0-9-]*`.
- Otherwise generate `<slug>-YYYYMMDD-HHmmss` using the current local time.
- Build `<slug>` from the first meaningful request words: lowercase ASCII, replace non-alphanumeric groups with `-`, trim hyphens and limit it to 40 characters. Use `run` if the slug would be empty.
- Refuse to continue if `.pipeline/runs/<run-id>/` already exists. Never reuse or silently suffix an existing run.
- Use `pnpm pipeline:create-run -- "<request>" [--run-id <run-id>]` to create the run and initialize `state.json`.
- Execute Planner and stop at `awaiting-approval`.

### `resume <run-id>`

Resume one existing run.

- Require a valid run ID and an existing `.pipeline/runs/<run-id>/`.
- Read `state.json` and all artifacts for the current attempt before acting.
- When state is `awaiting-approval`, invoking `resume` is explicit approval of the current spec.
- Refuse approval while `spec.md` contains `OPEN QUESTIONS`. Show the unresolved questions instead.
- When resuming an interrupted stage, inspect its required artifact first. Advance if the current attempt is already complete; otherwise finish that stage without duplicating attempt sections.
- Do not resume `blocked` or `ready-for-human-review`.
- When state is `needs-work` with attempt 2, stop for human direction. Never start a third implementation attempt.
- Prefer `pnpm pipeline:check-run -- <run-id>` for a compact state and artifact summary before selecting the next stage.

Reject unknown commands and show:

```text
$ship start <request> [--run-id <id>]
$ship resume <run-id>
```

## Run state

The orchestrator owns `.pipeline/runs/<run-id>/state.json` and updates it after every transition:

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

Allowed statuses:

- `planning`
- `awaiting-approval`
- `implementing`
- `testing`
- `reviewing`
- `needs-work`
- `blocked`
- `ready-for-human-review`

`lastVerdict` must be `null`, `SHIP`, `NEEDS WORK` or `BLOCK`.

Use `pnpm pipeline:set-state -- <run-id> <status> [--attempt 0|1|2] [--verdict "SHIP|NEEDS WORK|BLOCK|null"]` for state updates instead of editing `state.json` directly.

## Start flow

### 1. Planner

1. Run `pnpm pipeline:create-run -- "<request>" [--run-id <run-id>]`.
2. Confirm the command created `request.md` and `state.json` with status `planning`, attempt 0 and a UTC `updatedAt`.
3. Use the `planner` agent.
   - Prefer minimal context handoff: request, run ID, required artifact paths and applicable constraints.
   - Do not pass unrelated conversation history when the request and repository artifacts are sufficient.
4. Require:
   - `request.md`
   - `context.md`
   - `spec.md`
5. Set state to `awaiting-approval` with `pnpm pipeline:set-state -- <run-id> awaiting-approval`.
6. Stop and show the spec summary and any `OPEN QUESTIONS`.

Do not treat the absence of open questions as approval. The user must invoke `$ship resume <run-id>`.

## Resume flow

Resume from the recorded state. Validate existing artifacts before selecting a stage.

Use `pnpm pipeline:check-run -- <run-id>` before selecting a stage unless the current state and artifacts were already inspected in this turn.

### `planning`

Finish the Planner stage, set `awaiting-approval` with `pnpm pipeline:set-state -- <run-id> awaiting-approval` and stop.

### `awaiting-approval`

If `spec.md` contains `OPEN QUESTIONS`, stop and show them.

Otherwise treat this invocation as explicit approval:

- preserve attempt 2 when returning from a scope-changing review;
- otherwise set attempt to 1;
- set status to `implementing` with `pnpm pipeline:set-state -- <run-id> implementing --attempt <attempt>`;
- continue to Coder.

### `implementing`

Use the `coder` agent.

Prefer minimal context handoff: run ID, attempt, `spec.md`, `context.md`, relevant review artifact for attempt 2 and the required output path. Do not ask the Coder to re-audit unrelated repository areas.

For the current attempt, it must:

- read `spec.md` and `context.md`;
- read `review.md` when attempt is 2;
- implement only the approved spec;
- add or update tests when behavior changes;
- append exactly one attempt-labeled section to `changes.md`.

If a review finding changes scope, do not implement it. Return to Planner to revise the spec, set status to `awaiting-approval`, and stop for another explicit approval. Retain attempt 2.

When the current implementation attempt is complete, set status to `testing` with `pnpm pipeline:set-state -- <run-id> testing`.

### `testing`

Use the `tester` agent.

Prefer minimal context handoff: run ID, attempt, `spec.md`, `context.md`, `changes.md` and the required output path. Do not ask the Tester to repeat validation already recorded unless the implementation changed or a concrete gap exists.

It must:

- validate the approved change without modifying implementation or tests;
- start with the narrowest relevant commands;
- escalate according to blast radius and `docs/ai/testing.md`;
- append exactly one current-attempt section to `test-results.md`;
- record commands, results, failures, omitted checks and remaining risk.

Continue to Reviewer even when validation fails. Set status to `reviewing` with `pnpm pipeline:set-state -- <run-id> reviewing`.

### `reviewing`

Use the `reviewer` agent.

Prefer minimal context handoff: run ID, attempt, `spec.md`, `context.md`, `changes.md`, `test-results.md`, current diff scope and the required output path. Do not ask the Reviewer to run implementation or validation commands.

It must:

- read `spec.md`, `context.md`, `changes.md` and `test-results.md`;
- inspect the current diff;
- review scope, correctness, architecture, validation and template safety;
- apply `docs/ai/security.md` for security-sensitive work;
- write only `review.md`;
- end with exactly one current verdict.

Handle the verdict:

- `SHIP`: set `lastVerdict` to `SHIP`, status to `ready-for-human-review` with `pnpm pipeline:set-state -- <run-id> ready-for-human-review --verdict SHIP`, and stop.
- `BLOCK`: set `lastVerdict` to `BLOCK`, status to `blocked` with `pnpm pipeline:set-state -- <run-id> blocked --verdict BLOCK`, and stop.
- `NEEDS WORK` on attempt 1: set `lastVerdict` to `NEEDS WORK`, status to `needs-work` with `pnpm pipeline:set-state -- <run-id> needs-work --verdict "NEEDS WORK"`, and continue to the correction flow.
- `NEEDS WORK` on attempt 2: set `lastVerdict` to `NEEDS WORK`, status to `needs-work` with `pnpm pipeline:set-state -- <run-id> needs-work --verdict "NEEDS WORK"`, and stop for human direction.

### `needs-work` on attempt 1

Run exactly one correction cycle:

1. Set attempt to 2 and status to `implementing`.
   - Use `pnpm pipeline:set-state -- <run-id> implementing --attempt 2`.
2. Use Coder to address only findings inside the approved spec.
3. Append attempt 2 to `changes.md`.
4. Set status to `testing` and use Tester.
5. Append attempt 2 to `test-results.md`.
6. Preserve the first review with `pnpm pipeline:archive-review -- <run-id>`.
7. Set status to `reviewing` and use Reviewer again.
8. Apply the second verdict rules above.

## Final handoff

When stopping, report:

- run directory;
- current state and attempt;
- implementation summary;
- changed files;
- validation commands and results;
- current Reviewer verdict, when available;
- security review summary, when applicable;
- risks and limitations;
- required human action.

## Hard rules

- Keep Swiss Kit generic and template-friendly.
- Do not reintroduce finance-domain implementation.
- Do not copy Oppem systems wholesale.
- Preserve monorepo and frontend/backend/contracts boundaries.
- Treat auth, authorization, contracts, Prisma, CORS, JWT, cookies, environment validation and CI as sensitive.
- Do not alter approved scope.
- Do not hide validation failures.
- Do not replace earlier attempt history.
- Do not commit, push, open a pull request or merge.
