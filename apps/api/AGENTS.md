# API AGENTS.md

## Scope

These instructions apply to `apps/api`.

Read this file before changing Nest modules, controllers, services, repositories, guards, DTOs, Prisma access, auth, authorization, environment validation or API contracts.

Also read:

- root `AGENTS.md`
- `apps/api/docs/backend-boundaries.md`
- `docs/template.md` when changing template behavior
- `docs/module-authoring.md` when creating or changing a module
- `docs/codex-workflow.md` when working through the Codex pipeline

## Backend architecture

The API is a neutral Core baseline. Keep product-specific behavior out of shared infrastructure.

Expected dependency flow:

```text
module controller -> module service -> module repository -> PrismaService
```

Shared infrastructure should remain stable:

```text
modules -> common/config/prisma/contracts
```

A module should not import another module's internals. If cross-module behavior is required, the providing module must explicitly export a provider.

## Module rules

Recommended module shape:

```text
src/modules/<module>/
  <module>.module.ts
  <module>.controller.ts
  <module>.service.ts
  repositories/
    <module>.repository.ts
  dto/
    create-<resource>.dto.ts
    update-<resource>.dto.ts
  mappers/
    <resource>.mapper.ts
```

Keep files flatter when a module is tiny. Do not create empty folders only to satisfy the template.

Controllers should:

- define routes and route-level decorators;
- receive validated params/body/query DTOs;
- delegate business logic to services;
- return mapped response DTOs or shared contract objects.

Controllers should not:

- call Prisma directly;
- implement business rules;
- parse environment variables;
- perform large mapping logic.

Services should:

- coordinate use cases;
- enforce business rules;
- call repositories and explicitly exported providers;
- stay testable without HTTP.

Repositories should:

- wrap Prisma access;
- hide query details from controllers/services;
- avoid HTTP, cookies, headers and auth-flow concerns.

## Auth and authorization

The API has a global authentication guard. New routes are protected by default unless explicitly marked public.

Public routes must:

- document why they are public;
- avoid exposing sensitive data;
- include validation notes or tests when practical.

Authorization changes are high risk.

Local access-control should follow this direction:

- permission keys use `<module>:<action>`;
- backend guards enforce real security;
- frontend permission checks are only UX helpers;
- effective permissions may come from direct user permissions plus role-derived permissions;
- permission registration should be code-driven or seeded, not freely invented in UI flows.

Common actions:

```text
access
read
create
update
delete
manage
```

Example permission keys:

```text
users:access
users:create
settings:access
access-control:manage
```

Do not implement enterprise access-control, tenant isolation, external policy engines or Redis-backed session authorization unless explicitly scoped.

## DTOs and validation

Use Nest DTOs for incoming HTTP payloads.

The global ValidationPipe uses:

```text
whitelist: true
transform: true
forbidNonWhitelisted: true
```

New DTOs must be explicit about allowed fields. Do not accept arbitrary request bodies.

## Contracts

Use `packages/contracts` when a response or type crosses the frontend/backend boundary.

When changing a shared contract:

1. Update the contract schema/type.
2. Update API mapper/response code.
3. Update frontend consumption and parsing.
4. Run monorepo typecheck.

API-local contracts can stay under `apps/api/src/common/contracts` when they are not consumed outside the API.

## Prisma and migrations

Schema changes are high risk.

Before changing Prisma schema, decide:

- whether the change belongs in Core;
- whether it should be an example or future optional module;
- whether the migration is destructive;
- whether seed data must change;
- whether shared contracts must change.

Do not add product-specific tables to the Core baseline.

## Environment and configuration

Do not read `process.env` directly inside modules.

Use centralized config/env validation. When adding a required environment variable:

- update env validation;
- update `.env.example`;
- update documentation;
- consider deployment docs;
- never log secret values.

## Validation

For API-only changes, start with:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

For shared contracts, Prisma schema, auth, authorization, env or cross-workspace changes, also run:

```bash
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

If validation cannot run, record the exact reason.
