# API Module Authoring Guide

This guide describes how to add backend modules to Swiss Kit without weakening the template architecture.

Use it when creating a new module such as `users`, `access-control`, `settings`, `files` or another reusable template capability.

Check the repository [capability matrix](../../../docs/current/capability-matrix.md) first. `files` and `notifications` are Optional / Not implemented; multi-tenancy is Out of scope / Not implemented.

## Goal

A backend module should be easy to understand, test and remove.

A good module:

- owns one clear capability;
- exposes explicit routes through its controller;
- keeps business rules in services;
- keeps database access in repositories;
- uses DTOs for input validation;
- maps responses intentionally;
- avoids product-specific coupling;
- avoids leaking Prisma details to HTTP controllers.

## Recommended structure

```text
src/modules/<module>/
  <module>.module.ts
  <module>.controller.ts
  <module>.service.ts
  dto/
    create-<resource>.dto.ts
    update-<resource>.dto.ts
  repositories/
    <module>.repository.ts
  mappers/
    <resource>.mapper.ts
  __tests__/
    <module>.service.spec.ts
```

For very small modules, keep the structure simpler. Do not create empty folders without real files.

## Step-by-step

### 1. Define the module purpose

Before creating files, write down:

- what capability this module owns;
- whether it belongs in the Core template or in an optional preset;
- whether it needs database tables;
- whether it changes shared contracts;
- whether it touches auth, permissions or sensitive data.

### 2. Create the Nest module

Create:

```text
src/modules/<module>/<module>.module.ts
```

A module should import only the providers it needs and export only what other modules are allowed to consume.

Do not make internal services public by default.

### 3. Add the controller

Create:

```text
src/modules/<module>/<module>.controller.ts
```

Controllers should:

- define route paths;
- receive DTOs and params;
- delegate to services;
- return mapped response objects.

Controllers should not call Prisma directly.

### 4. Add the service

Create:

```text
src/modules/<module>/<module>.service.ts
```

Services should:

- coordinate use cases;
- enforce business rules;
- call repositories;
- call explicitly exported providers from other modules when needed.

### 5. Add repositories when database access exists

Create:

```text
src/modules/<module>/repositories/<module>.repository.ts
```

Repositories should wrap Prisma queries for the module.

Prefer repository methods named by domain intent:

```ts
findActiveUsers()
```

instead of raw mechanics:

```ts
findManyWhereIsActiveTrue()
```

### 6. Add DTOs and validation

Create DTOs under:

```text
src/modules/<module>/dto
```

Incoming payloads should be validated by explicit DTO classes. The global validation pipe strips unknown fields and rejects non-whitelisted fields.

### 7. Register the module

Register the module in `src/app.module.ts` only when it is part of the active API baseline.

If the module is an optional preset or example, document that clearly instead of silently enabling it.

### 8. Update docs and contracts

Update documentation when you add:

- routes;
- environment variables;
- Prisma models;
- public response shapes;
- setup steps;
- seed requirements.

Move response/request contracts to `packages/contracts` when the frontend needs to consume them directly.

## Public route checklist

Most routes should remain protected by the global guard.

Before marking a route public, confirm:

- why authentication is not required;
- what data is exposed;
- whether rate limiting is needed;
- whether the route can be abused;
- whether CORS/cookie behavior matters.

## Prisma checklist

Before adding or changing Prisma models:

- confirm the model belongs to the Core template;
- avoid product-specific tables in the baseline;
- update seed data if needed;
- update migrations;
- update contracts and mappers;
- check whether the change is destructive.

## Environment checklist

Before adding an environment variable:

- add it to env validation;
- add it to `.env.example`;
- document it;
- avoid logging it;
- define a safe default only if one exists.

## Validation commands

For API-only changes:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

For changes that touch shared contracts, Prisma, auth, env or workspace-level behavior:

```bash
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

## What not to do

Do not:

- put business logic in controllers;
- put product-specific behavior in `src/common`;
- create global providers for local module concerns;
- read `process.env` directly from feature modules;
- expose sensitive user fields by default;
- add enterprise infrastructure just because another system has it;
- reintroduce removed finance-domain behavior.
