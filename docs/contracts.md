# Contracts

## Purpose

`packages/contracts` is the shared API boundary between `apps/api` and `apps/web`.

Use it to keep frontend and backend aligned on:

- API response shapes;
- auth/current-user payloads;
- permission keys;
- module registry metadata;
- pagination and error envelopes.

## Current baseline

Active contract areas include:

```text
api.ts
  API error, status and pagination helpers

auth.ts
  auth status, current user and session contracts

permissions.ts
  permission action, permission key, role and effective permissions

modules.ts
  module id, module status and module definition contracts

users.ts
settings.ts
access-control.ts
access-control-catalog.ts
tasks.ts
  Core contracts plus the implemented Reference tasks contract
```

The runtime classification is maintained in [docs/current](./current/README.md). Do not create files or notifications contracts until those Optional capabilities are explicitly implemented.

## Permission key format

Use:

```text
<module>:<action>
```

Allowed baseline actions:

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
users:create
settings:access
access-control:manage
```

## Module registry direction

A module definition should expose only shell-level metadata:

```text
id
label
description
path
nav
status
requiredPermissions
```

The frontend shell can use this metadata to compose navigation and protected routes.

The backend remains the source of truth for real authorization.

## Contract rules

When changing a shared contract:

1. Update the schema/type in `packages/contracts`.
2. Update API DTOs/mappers if the backend emits the shape.
3. Update frontend parsing/consumption if the web app reads the shape.
4. Run monorepo typecheck when possible.

Do not add product-specific names or customer-specific fields to shared contracts.
