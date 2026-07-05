# Access Control

## Purpose

Swiss Kit uses local access-control as a Core template capability.

The first step is a permission catalog. It defines stable permission keys and exposes them through the API and web shell.

## Current state

This implementation is intentionally small:

- shared access-control contracts live in `packages/contracts/src/access-control.ts`;
- the API exposes `GET /api/access-control`;
- the web app shows the permission catalog in `/access-control`;
- no roles or user permission assignments are persisted yet;
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

## Next steps

Recommended follow-up PRs:

1. Add Prisma models for roles and assignments.
2. Seed default roles and permissions.
3. Return effective permissions from `/auth/me`.
4. Wire frontend navigation filtering.
5. Add backend permission guards.

Do not add multi-tenant authorization, Redis-backed sessions or external policy engines to the Core baseline.
