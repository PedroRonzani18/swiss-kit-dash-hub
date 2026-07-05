---
name: ship
description: Run the controlled Swiss Kit implementation pipeline from repository-grounded planning through human approval, coding, testing, review and human handoff.
argument-hint: "start <request> [--run-id <id>] | resume <run-id>"
disable-model-invocation: true
---

# Swiss Kit Ship

Run the repository's controlled implementation pipeline.

`ship` prepares a change for human review. It never commits, pushes, opens a pull request or merges.

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

## Commands

### `start <request> [--run-id <id>]`

Start a new pipeline run.

- Require a non-empty request.
- If `--run-id` is present, require it to match `[a-z0-9][a-z0-9-]*`.
- Otherwise generate `<slug>-YYYYMMDD-HHmmss` using the current local time.
- Build `<slug>` from the first meaningful request words: lowercase ASCII, replace non-alphanumeric groups with `-`, trim hyphens and limit it to 40 characters. Use `run` if the slug would be empty.
- Refuse to continue if `.pipeline/runs/<run-id>/` already exists. Never reuse or silently suffix an existing run.
- Create the run, initialize `state.json`, execute Planner and stop at `awaiting-approval`.

### `resume <run-id>`

Resume one existing run.

- Require a valid run ID and an existing `.pipeline/runs/<run-id>/`.
- Read `state.json` and all artifacts for the current attempt before acting.
- When state is `awaiting-approval`, invoking `resume` is explicit approval of the current spec.
- Refuse approval while `spec.md` contains `OPEN QUESTIONS`. Show the unresolved questions instead.
- When resuming an interrupted stage, inspect its required artifact first. Advance if the current attempt is already complete; otherwise finish that stage without duplicating attempt sections.
- Do not resume `blocked` or `ready-for-human-review`.
- When state is `needs-work` with attempt 2, stop for human direction. Never start a third implementation attempt.

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

## Start flow

### 1. Planner

1. Create `.pipeline/runs/<run-id>/`.
2. Write `state.json` with status `planning`, attempt 0 and a UTC `updatedAt`.
3. Use the `planner` agent.
4. Require:
   - `request.md`
   - `context.md`
   - `spec.md`
5. Set state to `awaiting-approval`.
6. Stop and show the spec summary and any `OPEN QUESTIONS`.

Do not treat the absence of open questions as approval. The user must invoke `$ship resume <run-id>`.

## Resume flow

Resume from the recorded state. Validate existing artifacts before selecting a stage.

### `planning`

Finish the Planner stage, set `awaiting-approval` and stop.

### `awaiting-approval`

If `spec.md` contains `OPEN QUESTIONS`, stop and show them.

Otherwise treat this invocation as explicit approval:

- preserve attempt 2 when returning from a scope-changing review;
- otherwise set attempt to 1;
- set status to `implementing`;
- continue to Coder.

### `implementing`

Use the `coder` agent.

For the current attempt, it must:

- read `spec.md` and `context.md`;
- read `review.md` when attempt is 2;
- implement only the approved spec;
- add or update tests when behavior changes;
- append exactly one attempt-labeled section to `changes.md`.

If a review finding changes scope, do not implement it. Return to Planner to revise the spec, set status to `awaiting-approval`, and stop for another explicit approval. Retain attempt 2.

When the current implementation attempt is complete, set status to `testing`.

### `testing`

Use the `tester` agent.

It must:

- validate the approved change without modifying implementation or tests;
- start with the narrowest relevant commands;
- escalate according to blast radius and `docs/ai/testing.md`;
- append exactly one current-attempt section to `test-results.md`;
- record commands, results, failures, omitted checks and remaining risk.

Continue to Reviewer even when validation fails. Set status to `reviewing`.

### `reviewing`

Use the `reviewer` agent.

It must:

- read `spec.md`, `context.md`, `changes.md` and `test-results.md`;
- inspect the current diff;
- review scope, correctness, architecture, validation and template safety;
- apply `docs/ai/security.md` for security-sensitive work;
- write only `review.md`;
- end with exactly one current verdict.

Handle the verdict:

- `SHIP`: set `lastVerdict` to `SHIP`, status to `ready-for-human-review`, and stop.
- `BLOCK`: set `lastVerdict` to `BLOCK`, status to `blocked`, and stop.
- `NEEDS WORK` on attempt 1: set `lastVerdict` to `NEEDS WORK`, status to `needs-work`, and continue to the correction flow.
- `NEEDS WORK` on attempt 2: set `lastVerdict` to `NEEDS WORK`, status to `needs-work`, and stop for human direction.

### `needs-work` on attempt 1

Run exactly one correction cycle:

1. Set attempt to 2 and status to `implementing`.
2. Use Coder to address only findings inside the approved spec.
3. Append attempt 2 to `changes.md`.
4. Set status to `testing` and use Tester.
5. Append attempt 2 to `test-results.md`.
6. Preserve the first review as `review-attempt-1.md`.
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
