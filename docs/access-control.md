# Access Control

## Purpose

Swiss Kit uses local access-control as a Core template capability.

The first step is a permission catalog. It defines stable permission keys and exposes them through the API and web shell.

## Current state

The current implementation is intentionally small:

- shared access-control contracts live in `packages/contracts/src/access-control.ts`;
- the API exposes `GET /api/access-control`;
- the web app shows the permission catalog in `/access-control`;
- Prisma models define roles and user/role permission assignments;
- Prisma seed synchronizes baseline permissions and system roles;
- no route or endpoint enforcement is wired to these permissions yet.

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
Permission
Role
UserRole
RolePermission
UserPermission
```

Effective permissions should be resolved as:

```text
user direct permissions + permissions inherited from assigned roles
```

`Permission.key` is the stable identifier used by code, contracts and future guards.

`Role.key` is the stable identifier for seeded roles such as `admin` or `member`.

## Seed model

The Prisma seed is idempotent and currently does three access-control steps:

1. Upserts every permission from `ACCESS_CONTROL_CORE_PERMISSIONS`.
2. Upserts system roles.
3. Upserts role-permission assignments.

Default roles:

```text
admin
  all Core permissions

member
  core:access
  settings:access
```

User-role assignment is intentionally not automatic yet. A future PR should assign roles after the authenticated user lifecycle is clear.

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

## Next steps

Recommended follow-up PRs:

1. Return effective permissions from `/auth/me`.
2. Wire frontend navigation filtering.
3. Add backend permission guards.
4. Add role/user assignment management UI.

Do not add multi-tenant authorization, Redis-backed sessions or external policy engines to the Core baseline.
