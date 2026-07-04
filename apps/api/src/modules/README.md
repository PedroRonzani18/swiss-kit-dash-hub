# API Modules

This directory contains routeable backend capabilities for the Swiss Kit API.

Current Core baseline modules:

- `auth`
- `core`
- `health`

Future template modules may include:

- `users`
- `access-control`
- `settings`
- `files`
- `notifications`

## Responsibility

A module owns one vertical capability.

A module may contain:

- controller;
- service;
- repository;
- DTOs;
- mappers;
- module-specific tests;
- module-specific constants.

## Expected dependency flow

```text
controller -> service -> repository -> PrismaService
```

Controllers should not call Prisma directly.

Services should coordinate use cases and enforce business rules.

Repositories should isolate database queries.

## Module registration

Only active baseline modules should be registered in `src/app.module.ts`.

Optional presets or examples should be documented before being enabled by default.

## Boundaries

Allowed:

- modules may import from `src/common` for shared API primitives;
- modules may inject providers exported by other modules;
- modules may use `PrismaService` through repositories;
- modules may use shared contracts when they define frontend/backend boundaries.

Avoid:

- importing another module's internal files directly;
- putting product-specific behavior in `src/common`;
- adding tables or migrations for product-specific use cases in the Core baseline;
- exposing public routes without documenting why.

## Sensitive changes

Treat these changes as high risk:

- auth;
- cookies;
- JWT;
- CORS;
- allowed emails;
- Prisma schema;
- migrations;
- environment validation;
- user profile shape;
- public routes.

High-risk changes should include stronger validation and review notes.
