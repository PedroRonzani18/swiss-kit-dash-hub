# Swiss Kit Core

Swiss Kit Core is a pnpm TypeScript monorepo for a reusable web-system baseline: React/Vite web, NestJS API, Prisma/PostgreSQL, and shared Zod contracts.

The checked-in runtime is documented in [docs/current](./docs/current/README.md). Start with its [capability matrix](./docs/current/capability-matrix.md) before planning work.

## Current baseline

- **Core / implemented:** Google OAuth, HttpOnly JWT cookie session, user provisioning and activation, local access control, health checks, web shell, and shared contracts.
- **Core / partial:** settings has a protected static overview but no persistence or editing.
- **Reference / implemented:** tasks demonstrates the complete web/API/contracts module path with static data.
- **Optional / not implemented:** files and notifications.
- **Out of scope / not implemented:** multi-tenancy.

## Requirements and local start

- Node.js 24
- pnpm 10+
- PostgreSQL (Docker is optional for local development)

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
docker compose -f apps/api/docker-compose.yml up -d
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate:dev
pnpm --filter api prisma:seed
pnpm dev
```

Set the required API runtime variables before starting. Optionally set `INITIAL_ADMIN_EMAIL` when running `prisma:seed` to create a new active administrator with the persistent `admin` role. Existing users are never changed by this flag. The running API never reads it. See [environment configuration](./docs/env.md).

Default local URLs:

- Web: `http://localhost:8080`
- API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api/docs`

## Repository layout

```text
apps/web           React + Vite frontend
apps/api           NestJS + Prisma API
packages/contracts shared Zod schemas and API-facing types
docs/current       runtime source of truth
```

## Documentation

- [Current implementation](./docs/current/README.md)
- [Core scope](./docs/core-scope.md)
- [Architecture](./docs/architecture.md)
- [Template usage](./docs/template-usage.md)
- [Environment](./docs/env.md)
- [Access control](./docs/access-control.md)
- [Deployment](./docs/deployment.md)
- [Contributing](./CONTRIBUTING.md)

## Validation

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```
