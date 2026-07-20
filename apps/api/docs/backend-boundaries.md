# Backend Boundaries

This document defines ownership and dependency boundaries for the Swiss Kit API.

The API should remain a neutral Core baseline. Product-specific behavior can be added later as explicit modules or optional presets, but it must not leak into shared infrastructure.

## Current baseline

The API currently registers `health`, `auth`, `core`, `settings`, `users`, `access-control`, and `tasks`. Consult the repository [capability matrix](../../../docs/current/capability-matrix.md) for classification: settings is Core / Partial and tasks is Reference / Implemented.

Prisma persists Core authentication, user access state, and local access-control records, including users, permission groups, permissions, roles, and direct/role assignments.

Files and notifications are Optional / Not implemented. Multi-tenancy is Out of scope / Not implemented. Do not add tenant isolation, Redis, S3, email delivery, queues, or external policy engines unless explicitly scoped.

## Layer direction

Recommended dependency flow:

```text
module controller -> module service -> module repository -> PrismaService
```

Shared infrastructure should flow inward from stable common layers:

```text
modules -> common/config/prisma/contracts
```

A module should not depend on another module's internal files unless that module explicitly exports a provider through its Nest module.

## Layer responsibilities

### `src/modules/*`

Owns routeable business modules.

A module may contain:

- controller
- service
- repository
- DTOs
- module-local mappers
- module-local tests
- module-local constants

### `src/common/*`

Owns reusable cross-cutting API primitives.

Examples:

- guards
- decorators
- filters
- pipes
- mappers
- common contracts
- common enums
- shared error behavior

Do not place product-specific business logic in `src/common`.

### `src/config/*`

Owns environment parsing and validation.

New environment variables must be added to validation before they are used by runtime code.

### `src/prisma/*`

Owns Prisma client wiring and database access infrastructure.

Business queries should usually live in module repositories, not in controllers.

## Module ownership rules

A module should own its own vertical slice.

Recommended structure:

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

Keep files flatter when the module is tiny. Do not create empty folders just to satisfy the template.

## Controller rules

Controllers should:

- define HTTP routes;
- apply route-level decorators;
- receive validated DTOs and params;
- delegate business logic to services;
- return response DTOs or mapped contract objects.

Controllers should not:

- call Prisma directly;
- contain business rules;
- parse environment variables;
- perform large mapping logic;
- know implementation details from another module.

## Service rules

Services should:

- coordinate business use cases;
- call repositories and other explicitly exported providers;
- enforce business rules;
- produce module-level results;
- keep behavior testable without HTTP.

Services should not:

- directly depend on request/response objects unless the use case requires it;
- hide infrastructure side effects;
- mutate unrelated modules;
- mix unrelated use cases in one method.

## Repository rules

Repositories should:

- wrap Prisma access for a module;
- keep query details away from controllers and services;
- expose methods named after domain intent, not raw SQL mechanics.

Repositories should not:

- contain HTTP concerns;
- read cookies or headers;
- implement auth flow decisions;
- return sensitive fields unless explicitly needed.

## DTOs and validation

Use Nest DTOs for incoming HTTP payloads.

The global ValidationPipe is configured with:

```text
whitelist: true
transform: true
forbidNonWhitelisted: true
```

That means new DTOs should be explicit about allowed fields.

Do not rely on unvalidated arbitrary request bodies.

## Contracts

Shared contracts belong in `packages/contracts` when they are consumed by more than one workspace or define frontend/backend boundaries.

API-local contracts may remain inside `apps/api/src/common/contracts` when they are only internal to the backend.

When changing a public contract:

1. Update the shared contract.
2. Update the API mapper/response.
3. Update frontend parsing/consumption.
4. Run typecheck across the monorepo.

## Auth and public routes

The API has a global JWT guard registered in `AppModule`.

That means new routes are protected by default unless explicitly marked public through the existing public-route convention.

When adding public routes:

- document why the route is public;
- avoid exposing sensitive data;
- avoid relying on security by obscurity;
- add tests or manual validation notes.

Auth-sensitive changes include:

- cookies;
- JWT;
- Google OAuth;
- CORS;
- user activation behavior;
- user profile shape;
- logout/session behavior.

These changes require stronger review.

## Environment and configuration

Do not read `process.env` directly inside modules.

Use `ConfigService` and keep environment validation centralized.

When adding a required environment variable:

- update env validation;
- update `.env.example`;
- update documentation;
- consider deployment docs;
- avoid logging secret values.

## Prisma and migrations

Schema changes are high risk.

Before changing Prisma schema, decide:

- whether the change belongs in the Core template;
- whether it is an optional preset instead;
- whether the migration is destructive;
- whether seed data must change;
- whether shared contracts must change.

Do not add product-specific tables to the Core baseline.

## Template safety rules

Because Swiss Kit is meant to become a reusable template:

- prefer generic modules such as `users`, `access-control`, `settings`, `files` and `notifications`;
- keep product-specific behavior out of `core`;
- do not copy Oppem API modules wholesale into the baseline;
- model enterprise features as optional presets before making them mandatory;
- do not reintroduce removed finance-domain models, endpoints or contracts.

## Validation

For API-only module changes, start with:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

For shared contracts, Prisma schema, auth, env or cross-workspace changes, also run:

```bash
pnpm typecheck
pnpm test:ci
pnpm build:ci
```
