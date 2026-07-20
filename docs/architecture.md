# Architecture

The current runtime inventory lives in [docs/current](./current/README.md). This document explains its boundaries.

## Applications and dependency flow

```text
apps/web: src/app -> src/modules -> src/features -> src/shared and src/api
apps/api: controller -> service -> repository -> PrismaService
packages/contracts: Zod schemas and API-facing types shared by web and API
```

The web sends cookie-authenticated requests through its fetch client. The API applies global JWT authentication and then permission checks where a controller declares `@RequirePermissions()`. Web permission filtering is UX only.

## Active modules

The API registers `auth`, `core`, `health`, `settings`, `users`, `access-control`, and `tasks`. The web registry exposes routes for `core`, `settings`, `users`, `access-control`, and `tasks`.

`tasks` is the implemented reference module. `settings` is Core but partial: it returns and renders static sections only. See the [capability matrix](./current/capability-matrix.md).

## Authentication and bootstrap

Google OAuth starts at `/api/auth/google`. On callback the API verifies that the normalized email belongs to an active user, atomically binds an unbound Google identity, issues a JWT in an HttpOnly cookie, and returns effective roles and permissions from `/api/auth/me`.

`INITIAL_ADMIN_EMAIL` is optional seed-only configuration. When present for an email with no existing user, Prisma seed creates an active unbound user and persistent `admin` assignment. Runtime does not read it: Google login binds the matching user while preserving existing roles, and users with no role assignments receive `member` when that role exists. The seed never reactivates or promotes an existing record from this variable.

## Persistence

Prisma persists Core authentication and local access-control data: users, permission groups, permissions, roles, and direct/role permission assignments. There is no tenant model or tenant-aware query path.

## Operational surface

- Swagger: `/api/docs`
- Health: `/api/health/live`, `/api/health/ready`, and `/api/health`
- `settings` and `tasks` endpoints deliberately return static reference/overview data.

See [backend boundaries](../apps/api/docs/backend-boundaries.md) and [frontend boundaries](../apps/web/docs/frontend-boundaries.md) for ownership rules.
