# Swiss Kit Template

## Purpose

Swiss Kit Core is a reusable monorepo baseline for web systems.

It should provide the stable foundation that most systems need without forcing enterprise complexity into every new project.

Core currently centers on:

- React web shell;
- NestJS API;
- Google OAuth with HttpOnly cookie session;
- protected `/app` area;
- users and allowed emails baseline;
- health checks;
- shared contracts;
- pnpm workspaces and Turbo orchestration;
- CI and validation commands;
- Codex governance docs.

## Design goal

The goal is not to create a generic version of a specific product.

The goal is to create a small, predictable template that can be safely extended by Codex and by human developers.

Recommended direction:

```text
Swiss Kit Core
  auth Google + HttpOnly cookie
  users baseline
  settings baseline
  access-control local
  health checks
  shared contracts
  frontend shell
  frontend internationalization
  module registry
  module scaffold
  docs and AGENTS guidance
```

## Core principles

### 1. Keep Core small

Core should contain only reusable baseline capabilities.

Avoid adding mandatory enterprise infrastructure unless a task explicitly changes the template direction.

Out of scope for the Core baseline by default:

- multi-tenant isolation;
- Redis session infrastructure;
- S3/file storage;
- email sending;
- queues;
- customer-specific structures;
- product-specific dashboards.

### 2. Make modules explicit

New functionality should enter through explicit modules.

A module should own its vertical slice:

- route/page composition in the frontend;
- controller/service/repository in the backend;
- shared contracts when the frontend/backend boundary needs them;
- docs when the module establishes a reusable pattern.

### 3. Prefer contracts over implicit coupling

Frontend and backend should share API boundary shapes through `packages/contracts` when practical.

Contracts should be generic and template-friendly. They must not encode product-specific behavior.

### 4. Make access-control local and understandable

Swiss Kit can include a local access-control module, but it should remain simple:

- users;
- roles;
- permissions;
- direct user permissions;
- role-derived permissions;
- module access checks.

Avoid tenant-aware, policy-engine or enterprise authorization patterns unless explicitly scoped.

### 5. Optimize for Codex handoff

Every recurring architectural choice should be documented so Codex can follow it without inventing patterns.

Required guidance lives in:

- `AGENTS.md`;
- scoped `AGENTS.md` files;
- `docs/module-authoring.md`;
- `docs/codex-workflow.md`;
- app boundary docs.

## What belongs in Core

Good Core candidates:

- auth/session baseline;
- users baseline;
- settings baseline;
- local access-control;
- health checks;
- shared API error/pagination/session contracts;
- frontend module registration;
- frontend locale catalogs and language selection;
- module scaffold tooling;
- CI and validation scripts;
- reusable docs and agent instructions.

## What does not belong in Core by default

Avoid adding these directly to Core unless the task explicitly asks for it:

- client-specific terminology;
- one customer's workflows;
- legacy product modules copied from another app;
- external storage providers;
- email templates;
- multi-database tenant routing;
- product analytics;
- domain dashboards;
- heavy role hierarchies;
- advanced permission inheritance.

## Template safety checklist

Before adding a new capability, answer:

- Is this needed by most systems created from the template?
- Can it be described with generic names?
- Does it require new infrastructure?
- Does it affect auth, permissions, contracts, Prisma or deployment?
- Should it be a Core module, an example module or deferred future work?
- What docs must Codex read before changing it again?

If the answer is unclear, keep the change smaller and document the open question.
