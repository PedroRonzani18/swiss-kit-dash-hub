# Access Control

## Purpose

Swiss Kit uses local access-control as a Core template capability. Its current status is **Core / Implemented**; it is not a complete administration product. See the [capability matrix](./current/capability-matrix.md).

The first step is a permission catalog. It defines stable permission keys and exposes them through the API and web shell.

## Current state

The current implementation is intentionally small:

- shared access-control contracts live in `packages/contracts/src/access-control.ts`;
- the API exposes `GET /api/access-control`;
- `GET /api/access-control` reads persisted permissions and roles when the database is seeded;
- the web app shows the permission catalog in `/access-control`;
- Prisma models define roles and user/role permission assignments;
- Prisma seed synchronizes baseline permissions and system roles;
- `/auth/me` returns effective `roles` and `permissions`;
- frontend shell routes, sidebar and command palette filter modules by permissions;
- backend endpoints can require permissions with `@RequirePermissions()`;
- a global access guard enforces required permissions after JWT authentication.

## Permission keys

Permission keys follow this format:

```text
<module>:<action>
```

Baseline actions:

```text
access
read
create
update
delete
manage
```

Examples:

```text
users:access
users:read
users:create
access-control:manage
```

## Persistence model

Access-control persistence is local and template-friendly.

Prisma models:

```text
PermissionGroup
Permission
Role
UserRole
RolePermission
UserPermission
```

Effective permissions are resolved as:

```text
user direct permissions + permissions inherited from assigned roles
```

Target relationship:

```text
User -> UserRole -> Role -> RolePermission -> Permission -> PermissionGroup
User -> UserPermission -> Permission -> PermissionGroup
```

`Permission.key` is the stable identifier used by code, contracts and guards.

`PermissionGroup` organizes permissions for administration and visibility only. It does not grant access by itself.

`Role.key` is the stable identifier for seeded roles such as `admin` or `member`.

## Seed model

The Prisma seed is idempotent and currently does four access-control steps:

1. Upserts every permission group from `ACCESS_CONTROL_PERMISSION_GROUPS`.
2. Upserts every permission from `ACCESS_CONTROL_CORE_PERMISSIONS`.
3. Upserts system roles.
4. Upserts role-permission assignments.

Default roles:

```text
admin
  all Core permissions

member
  core:access
  settings:access
```

Area-specific roles:

```text
users-manager
  users:access
  users:read
  users:create
  users:update

users-viewer
  users:access
  users:read

access-control-manager
  access-control:access
  access-control:read
  access-control:manage

tasks-viewer
  tasks:access
  tasks:read
```

`users-manager` can provision/reactivate users and update their activation state.

On Google login, users with no role assignments receive the seeded `member` role when it exists. Existing assignments are preserved:

```text
no UserRole assignment -> member
existing UserRole assignment -> unchanged
```

`INITIAL_ADMIN_EMAIL` is an optional seed-only variable. When present for an email without an existing user, seed creates an active unbound user and `admin` assignment. The running API never reads it and seed never reactivates or promotes an existing record from this variable.

## Frontend filtering

The frontend uses effective permissions from `/auth/me` for UX-level filtering only:

```text
module registry -> auth permissions -> visible routes/navigation
```

Frontend filtering is not a security boundary. Backend guards still enforce permission checks on protected endpoints.

## Backend enforcement

Use `@RequirePermissions()` on controllers or handlers:

```ts
@RequirePermissions('users:read')
@Get()
getOverview() {}
```

The global access guard allows routes with no required permissions. When permissions are required, the guard resolves direct user permissions plus role-inherited permissions and returns `403` if any required permission is missing.

## Access-control overview

`GET /api/access-control` returns persisted permission groups, permissions and roles from Prisma.

If the access-control tables are empty, the API falls back to the static group and permission catalog so the page remains useful before the seed runs.

Run the seed after adding new permission keys:

```bash
pnpm --filter api prisma:seed
```

## Migration notes

This repository stores Prisma models under `apps/api/prisma/schema`.

When applying this change locally, generate a migration from the API workspace after reviewing the schema:

```bash
pnpm --filter api prisma:migrate:dev --name add-access-control-models
```

Then regenerate the Prisma client if needed:

```bash
pnpm --filter api prisma:generate
```

After the schema exists in the database, run the seed:

```bash
pnpm --filter api prisma:seed
```

## Model notes

- `Permission` remains the authorization unit enforced by backend guards.
- `PermissionGroup` is organizational metadata only.
- `Role` packages explicit permissions through `RolePermission`.
- `UserPermission` remains the direct-grant exception path for administrators.
- This baseline does not add tenant scoping, deny rules or external policy engines.

## Limitations

Role and direct-grant management write surfaces are not implemented; the endpoint and UI currently expose catalog/role overview only. Do not add multi-tenant authorization, Redis-backed sessions, or external policy engines to the Core baseline without explicit scope. See [known limitations](./current/known-limitations.md).
