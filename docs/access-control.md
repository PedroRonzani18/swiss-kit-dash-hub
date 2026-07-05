# Access Control

## Purpose

Swiss Kit uses local access-control as a Core template capability.

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
allowed-emails:create
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
allowed-emails-manager
  allowed-emails:access
  allowed-emails:read
  allowed-emails:create
  allowed-emails:update

allowed-emails-viewer
  allowed-emails:access
  allowed-emails:read

users-manager
  users:access
  users:read

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

`users-manager` is intentionally seeded now even though the current template does not expose user write permissions yet. In this baseline, it is equivalent to `users-viewer` until write permissions are introduced.

On Google login, users are assigned a default role if the role exists:

```text
primary owner email -> admin
other allowed users -> member
```

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

## Next steps

Recommended follow-up PRs:

1. Add role/user assignment write endpoints.
2. Add role/user assignment management UI.
3. Add tests around access checks.

Do not add multi-tenant authorization, Redis-backed sessions or external policy engines to the Core baseline.
