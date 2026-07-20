# Swiss Kit Core

Swiss Kit Core is a pnpm TypeScript monorepo for a reusable web-system baseline: React/Vite web, NestJS API, Prisma/PostgreSQL, and shared Zod contracts.

The checked-in runtime is documented in [docs/current](./docs/current/README.md). Start with its [capability matrix](./docs/current/capability-matrix.md) before planning work.

## Current baseline

- **Core / implemented:** Google OAuth, HttpOnly JWT cookie session, user provisioning and activation, local access control, health checks, web shell, and shared contracts.
- **Core / partial:** settings has a protected static overview but no persistence or editing.
- **Reference / implemented:** tasks demonstrates the complete web/API/contracts module path with static data.
- **Optional / not implemented:** files and notifications.
- **Out of scope / not implemented:** multi-tenancy.

## Local start and commands

Follow the [local setup guide](./docs/guides/local-setup.md). The [command reference](./docs/reference/scripts.md) is the source of truth for setup, database, development, and validation commands.

## Repository layout

```text
apps/web           React + Vite frontend
apps/api           NestJS + Prisma API
packages/contracts shared Zod schemas and API-facing types
docs/current       runtime source of truth
```

## Documentation

- [Current implementation](./docs/current/README.md)
- [Local setup](./docs/guides/local-setup.md)
- [Command reference](./docs/reference/scripts.md)
- [Core scope](./docs/core-scope.md)
- [Architecture](./docs/architecture.md)
- [Template usage](./docs/template-usage.md)
- [Environment](./docs/env.md)
- [Access control](./docs/access-control.md)
- [Deployment](./docs/deployment.md)
- [Contributing](./CONTRIBUTING.md)

## Validation

Run `pnpm check` for the Docker-free gate and `pnpm verify` for the complete isolated verification gate. See the [command reference](./docs/reference/scripts.md) for prerequisites and exact behavior.
