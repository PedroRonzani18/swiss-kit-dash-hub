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
3. Read the relevant architecture or boundary docs before changing structure.
4. Read existing code patterns before adding new abstractions.

Scoped instruction files:

- `apps/web/AGENTS.md` for frontend work.
- `apps/api/AGENTS.md` for backend work.
- `packages/contracts/AGENTS.md` for shared contracts.
- `docs/AGENTS.md` for documentation changes.

When instructions conflict, follow the most specific applicable file, unless it violates this root file.

## Current architecture

### Monorepo

Root workspaces:

- `apps/*`
- `packages/*`

### Frontend

Path: `apps/web`

Expected layering:

```text
src/app
  -> routes, providers, app shell

src/modules/*
  -> pages and module-level composition

src/features/*
  -> domain behavior and feature UI

src/components
  -> reusable UI and layout

src/shared
  -> HTTP, query, utilities, auth helpers and cross-cutting code
```

Do not bypass existing frontend boundaries unless the task explicitly asks for a structural refactor.

### Backend

Path: `apps/api`

Expected backend style:

```text
controller -> service -> repository/prisma
```

Keep modules focused. Do not introduce enterprise features such as multi-tenant isolation, Redis, S3, email, queues, i18n or advanced enterprise permissions unless the task explicitly asks for that.

Local access control can become a Core module only when it remains template-friendly, explicit and scoped to module access/role/permission management.

### Contracts

Path: `packages/contracts`

Shared contracts should remain generic and template-friendly.

- Do not introduce product-specific or client-specific naming into shared contracts.
- Validate API responses on the frontend when appropriate.
- Preserve frontend/backend compatibility unless the task explicitly asks for a breaking change.

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

Avoid product-specific names unless the task is explicitly creating an example module.

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

Use small roles to reduce drift and token waste.

### Planner

The Planner turns a request into a repository-grounded implementation spec.

The Planner must:

- inspect current repo state;
- read applicable `AGENTS.md` files;
- read relevant docs and source files;
- identify the smallest safe scope;
- write `.pipeline/runs/<run-id>/request.md`, `context.md` and `spec.md`;
- stop if open questions affect auth, permissions, contracts, migrations or public API.

The Planner must not:

- implement production code;
- write tests;
- refactor;
- modify files outside `.pipeline/runs/<run-id>/`.

### Implementer

The Implementer applies an approved spec with minimal scope.

The Implementer must:

- follow the spec exactly;
- keep unrelated files untouched;
- prefer existing patterns;
- update docs when architecture, commands, setup or contracts change;
- record implementation notes in `.pipeline/runs/<run-id>/changes.md` when using the pipeline.

The Implementer must not:

- invent business rules;
- expand scope silently;
- add dependencies without justification;
- change migrations, auth, permissions or contracts without explicit scope.

### Reviewer

The Reviewer performs a read-only review.

The Reviewer must check:

- scope adherence;
- frontend/backend/contracts boundaries;
- auth, authorization, cookies, CORS and validation risk;
- template safety;
- product-specific leakage;
- missing tests or missing validation notes.

The Reviewer must not modify files.

### Tester

The Tester validates the change and records what ran.

The Tester must:

- run the narrowest relevant commands first;
- run broader commands for cross-workspace changes;
- capture failures honestly;
- write `.pipeline/runs/<run-id>/test-results.md` when using the pipeline.

The Tester must not hide failures or claim validation that did not run.

## Commands

Use pnpm from the repository root.

### Root commands

- Install: `pnpm install`
- Dev all: `pnpm dev`
- Build all: `pnpm build`
- Build CI: `pnpm build:ci`
- Lint all: `pnpm lint`
- Lint CI: `pnpm lint:ci`
- Test all: `pnpm test`
- Test CI: `pnpm test:ci`
- Typecheck all: `pnpm typecheck`

### Filtered commands

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

### Validation preference

For narrow changes, run the most specific relevant command first.

For larger changes, prefer:

1. `pnpm lint:ci`
2. `pnpm typecheck`
3. `pnpm test:ci`
4. `pnpm build:ci`

For frontend E2E changes, also run `pnpm test:web:e2e` when applicable.

For documentation-only changes, validation may be limited to a read-through and link/path checks. If commands are not run, state that clearly in the PR.

If a command cannot run because of the local environment, record exactly why.

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

GitHub actions:

- Creating branches, commits or pull requests is allowed only when the user explicitly asks for it.
- Merging pull requests requires a separate explicit request.
- Closing or retargeting pull requests requires a separate explicit request.

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

Main files:

- `request.md`: original request
- `context.md`: relevant repository context found by Planner
- `spec.md`: implementation spec generated by Planner
- `changes.md`: implementation summary generated by Implementer
- `test-results.md`: validation result, when a separate Tester stage is used
- `review.md`: final read-only review
- `state.json`: pipeline state

Rules:

- Never reuse files from a previous run.
- Never hide failed tests.
- Never mark work done without validation or a clear explanation of why validation could not run.
- If `spec.md` contains `OPEN QUESTIONS`, stop before coding.

## Planning standards

A good spec must include:

- objective
- in scope
- out of scope
- files likely to change
- contracts or public interfaces affected
- acceptance criteria
- edge cases
- relevant commands
- risks
- open questions, if any

## Implementation standards

The implementation must:

- follow the spec exactly
- keep unrelated files untouched
- use existing patterns before creating new abstractions
- update tests when behavior changes
- update docs when architecture, commands or setup change
- explain any dependency, contract or schema change

## Review standards

A change is not ready if:

- it does not implement the spec
- it changes behavior outside scope
- tests are superficial or missing
- it weakens auth, validation or type safety
- it adds product-specific naming to the template core
- it breaks frontend/backend contracts
- it bypasses existing layering
- it modifies migrations or schema without justification
- it cannot be validated and the limitation is not clearly documented
