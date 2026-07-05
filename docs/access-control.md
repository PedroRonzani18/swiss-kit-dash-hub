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

## Next steps

Recommended follow-up PRs:

1. Seed default permissions from `ACCESS_CONTROL_CORE_PERMISSIONS`.
2. Seed default roles and role-permission assignments.
3. Return effective permissions from `/auth/me`.
4. Wire frontend navigation filtering.
5. Add backend permission guards.

Do not add multi-tenant authorization, Redis-backed sessions or external policy engines to the Core baseline.
