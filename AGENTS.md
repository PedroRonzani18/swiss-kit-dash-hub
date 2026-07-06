# AGENTS.md

## Project overview

Swiss Kit Core is a modular monorepo intended to become a reusable template for web systems.

The repository uses:

- pnpm workspaces
- Turbo
- `apps/web` for the React frontend
- `apps/api` for the NestJS backend
- `packages/contracts` for shared contracts
- shared tooling under `packages/*`

The current goal is to preserve the Core baseline and gradually evolve it into a template that can be reused to bootstrap other systems.

## Codex operating model

This repository is optimized for Codex-driven development. Treat these instructions as the source of truth before planning, editing, reviewing or testing.

Required reading before any task:

1. Read this root `AGENTS.md`.
2. Read the nearest scoped `AGENTS.md` for every area you will touch.
3. Read relevant architecture or boundary docs before changing structure.
4. Read existing code patterns before adding new abstractions.

Scoped instruction files:

- `apps/web/AGENTS.md` for frontend work.
- `apps/api/AGENTS.md` for backend work.
- `packages/contracts/AGENTS.md` for shared contracts.
- `docs/AGENTS.md` for documentation changes.

When instructions conflict, follow the most specific applicable file, unless it violates this root file.

## Codex flow selection

Use the lightest workflow that can safely complete the task.

Default to the direct flow:

```text
inspect -> implement -> targeted validation -> review diff -> handoff
```

Use this for explanation, diagnosis, small localized fixes and non-sensitive changes with clear validation.

Use a controlled lightweight flow when the change is medium-sized or benefits from explicit approval:

```text
short plan -> human approval -> implementation -> targeted validation -> handoff
```

Reserve the full `$ship` pipeline for changes where independent roles materially reduce risk:

- authentication, authorization, access-control, JWT, cookies, CORS or allowed emails;
- contracts or public API compatibility;
- Prisma schema, migrations or environment validation;
- CI, deployment or security-sensitive configuration;
- broad architecture, module-boundary or template-direction changes;
- any change where the user explicitly requests `$ship`.

Do not use `$ship` for every micro-refinement. Consolidate related visual, copy, spacing, responsive and cleanup adjustments into one scoped request with one validation pass.

For every workflow:

- read each required instruction or source file once unless it changes;
- use `rg` to locate symbols before opening broad file ranges;
- consolidate related patches by logical unit;
- run targeted validation before wider suites;
- pause and report if the task starts requiring repeated inspection, repeated validation or a context-heavy restart.

## Architecture boundaries

Frontend path: `apps/web`.

Expected layering:

```text
src/app -> src/modules -> src/features -> src/shared
```

Backend path: `apps/api`.

Expected backend style:

```text
controller -> service -> repository/prisma
```

Contracts path: `packages/contracts`.

Shared contracts should remain generic and template-friendly.

## Swiss Kit template direction

This repo should evolve toward a reusable template.

Prefer generic names such as:

- `core`
- `auth`
- `users`
- `access-control`
- `settings`
- `files`
- `notifications`

Do not copy Oppem systems wholesale. Use them as references for patterns, governance and optional ideas, not as the architecture source of truth.

Recommended template shape:

```text
Swiss Kit Core
  auth Google + HttpOnly cookie
  users baseline
  settings baseline
  health checks
  shared contracts
  web shell
  module registry
  local access-control
  module scaffold
  CI and validation
  Codex governance
```

Avoid turning Core into a mandatory enterprise product with multi-tenant isolation, Redis sessions, S3, email, i18n or customer-specific structure.

## Codex agent roles

Use this full pipeline flow only when the task selection rules above justify it:

```text
Planner -> human approval -> Coder -> Tester -> Reviewer
```

Every run started through the `$ship` skill must stop after planning and wait for explicit human approval, even when the spec has no open questions. Trivial or low-risk work should be handled outside the pipeline when the request and validation scope are already unambiguous.

### Planner

The Planner turns a request into a repository-grounded implementation spec.

The Planner must inspect current repo state, read applicable docs, identify the smallest safe scope and write pipeline planning artifacts.

The Planner must not implement production code, write tests, refactor or modify files outside `.pipeline/runs/<run-id>/`.

If `spec.md` contains `OPEN QUESTIONS`, those questions must be resolved in the spec before approval.

### Coder

The Coder applies an approved spec with minimal scope.

The Coder must follow the spec exactly, keep unrelated files untouched, prefer existing patterns and record implementation notes in `.pipeline/runs/<run-id>/changes.md` when using the pipeline.

The Coder must not invent business rules, expand scope silently, add dependencies without justification or change migrations, auth, permissions or contracts without explicit scope.

When addressing a review, the Coder may fix only findings that remain inside the approved spec. A finding that changes scope must return to the Planner and requires new human approval.

### Tester

The Tester validates the change and records what ran.

The Tester must run the narrowest relevant commands first, capture failures honestly and write `.pipeline/runs/<run-id>/test-results.md` for every pipeline run.

The Tester must not fix implementation or tests, hide failures or claim validation that did not run.

### Reviewer

The Reviewer performs a read-only review of the implementation after the Tester has recorded validation.

The Reviewer checks scope adherence, frontend/backend/contracts boundaries, auth and authorization risk, template safety, product-specific leakage and missing validation notes.

The Reviewer must not modify implementation, tests or configuration. When using the pipeline, it may write only its review artifact under `.pipeline/runs/<run-id>/`.

### Pipeline outcomes

- `VERDICT: SHIP` hands the diff to a human for final review.
- `VERDICT: BLOCK` stops the pipeline immediately.
- The first `VERDICT: NEEDS WORK` may run one correction cycle through Coder, Tester and Reviewer.
- A second `VERDICT: NEEDS WORK` stops and returns control to the human.
- Commit, push, pull request creation and merge remain separate actions that require explicit user requests.

## Commands

Use pnpm from the repository root.

For noisy read-heavy shell work, prefer `rtk` wrappers when the exact raw output is not required. This applies especially to repository inspection, search, diff, lint, typecheck, test and build commands.

Examples:

- `rtk git status`
- `rtk git diff --stat`
- `rtk rg "pattern" .`
- `rtk find .`
- `rtk pnpm lint`
- `rtk pnpm typecheck`
- `rtk pnpm test`
- `rtk pnpm build`

Root commands:

- Install: `pnpm install`
- Dev all: `pnpm dev`
- Build all: `pnpm build`
- Build CI: `pnpm build:ci`
- Lint all: `pnpm lint`
- Lint CI: `pnpm lint:ci`
- Test all: `pnpm test`
- Test CI: `pnpm test:ci`
- Typecheck all: `pnpm typecheck`

Filtered commands:

- Dev web: `pnpm dev:web`
- Dev api: `pnpm dev:api`
- Build web: `pnpm build:web`
- Build api: `pnpm build:api`
- Lint web: `pnpm lint:web`
- Lint api: `pnpm lint:api`
- Test web: `pnpm test:web`
- Test web E2E: `pnpm test:web:e2e`
- Test api: `pnpm test:api`
- Typecheck web: `pnpm typecheck:web`
- Typecheck api: `pnpm typecheck:api`

Pipeline helper commands:

- Create run state: `pnpm pipeline:create-run -- "<request>" [--run-id <run-id>]`
- Update run state: `pnpm pipeline:set-state -- <run-id> <status> [--attempt 0|1|2] [--verdict "SHIP|NEEDS WORK|BLOCK|null"]`
- Check run summary: `pnpm pipeline:check-run -- <run-id>`
- Archive first review: `pnpm pipeline:archive-review -- <run-id>`

Codex hook helpers:

- Protected-path hook config: `.codex/hooks.json`
- Protected-path hook script: `node .codex/hooks/protect-paths.mjs`
- Hooks are guardrails, not a complete enforcement boundary. Confirm with `/hooks` after enabling or changing them.

For larger changes, prefer:

1. `pnpm lint:ci`
2. `pnpm typecheck`
3. `pnpm test:ci`
4. `pnpm build:ci`

For documentation-only changes, validation may be limited to a read-through and link/path checks. If commands are not run, state that clearly in the PR.

## General rules

- Never merge unless explicitly asked.
- Never alter files outside the task scope.
- Prefer small, localized and reversible changes.
- Do not refactor unrelated code.
- Do not introduce new dependencies without justification.
- Do not invent business rules.
- Do not reintroduce removed finance-domain behavior.
- Do not turn this Core template into a product-specific application.
- Preserve API compatibility unless the task explicitly asks for a breaking change.
- Preserve shared contracts unless a contract change is part of the spec.
- When unsure about a domain rule, stop and document the question.

Creating branches, commits or pull requests is allowed only when the user explicitly asks for it. Merging requires a separate explicit request.

## Sensitive areas

Treat changes as high risk when they touch:

- authentication
- authorization
- access-control
- permission checks
- JWT
- cookies
- CORS
- Google OAuth
- allowed emails
- users
- contracts
- migrations
- Prisma schema
- environment validation
- deployment configuration
- CI
- secrets
- logging
- file uploads
- future tenant or multi-tenant behavior

For these changes, require stronger review and security review.

## Pipeline convention

This repo may use `.pipeline/runs/<run-id>/` for handoff between Codex agents.

Start and resume the controlled pipeline with:

```text
$ship start <request> [--run-id <id>]
$ship resume <run-id>
```

The project skill at `.agents/skills/ship/SKILL.md` is the executable source of truth for orchestration.

Main files:

- `request.md`: original request
- `context.md`: relevant repository context found by Planner
- `spec.md`: implementation spec generated by Planner
- `changes.md`: implementation summary generated by Coder
- `test-results.md`: validation result generated by Tester
- `review.md`: final read-only review
- `review-attempt-1.md`: archived first review when a correction cycle occurs
- `state.json`: pipeline state

Rules:

- Never reuse files from a previous run.
- Never hide failed tests.
- Never mark work done without validation or a clear explanation of why validation could not run.
- Always stop for human approval after planning.
- If `spec.md` contains `OPEN QUESTIONS`, resolve them in the spec before approval.
- Tester runs before Reviewer.
- Preserve earlier implementation and validation results in attempt-labeled sections.
- A scope-changing review finding returns to Planner and invalidates the previous approval.

## Planning standards

A good spec must include objective, scope, likely files to change, public interfaces affected, acceptance criteria, edge cases, relevant commands, risks and open questions.

## Implementation standards

The implementation must follow the spec, keep unrelated files untouched, use existing patterns before new abstractions, update tests when behavior changes and update docs when architecture, commands or setup change.

## Review standards

A change is not ready if it changes behavior outside scope, weakens auth/validation/type safety, adds product-specific naming to the template core, breaks contracts, bypasses layering, modifies migrations without justification or cannot be validated clearly.
