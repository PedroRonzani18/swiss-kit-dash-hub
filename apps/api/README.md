# Swiss Kit API

NestJS API for the Swiss Kit Core baseline. The current runtime surface is maintained in [docs/current](../../docs/current/README.md).

## Active modules

- `auth`: Google OAuth, JWT cookie session, logout, and current user.
- `core`: protected neutral session check.
- `health`: liveness and readiness checks.
- `settings`: protected static overview only (**Core / Partial**).
- `users`: persisted directory, provisioning/reactivation, and status update routes (**Core / Implemented**).
- `access-control`: persisted catalog and roles overview with permission enforcement (**Core / Implemented**).
- `tasks`: static full-stack module example (**Reference / Implemented**).

Files and notifications are Optional / Not implemented. Multi-tenancy is Out of scope / Not implemented.

## Run locally

When provisioning an administrator through seed, set `INITIAL_ADMIN_EMAIL` and run:

```bash
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate:dev
pnpm --filter api prisma:seed
pnpm dev:api
```

Use `prisma:migrate:dev` only with a local or disposable database.

## Environment and bootstrap

Copy `apps/api/.env.example` to `apps/api/.env` and set required runtime values. `INITIAL_ADMIN_EMAIL` is optional and used only by Prisma seed. When present for an email with no existing user, seed creates an active, unbound user and persistent `admin` assignment. The running API does not validate or read the variable or alter existing access from it.

Google login updates the placeholder user for the same email while retaining its role; users without any role assignment receive `member` when that seeded role exists.

## Operational endpoints

- `GET /api/health/live`
- `GET /api/health/ready`
- `GET /api/health` (readiness compatibility alias)
- Swagger: `/api/docs`

Authentication starts at `GET /api/auth/google`. The OAuth callback sets an HttpOnly cookie. Protected routes accept that cookie, with optional `Authorization: Bearer` fallback. API guards, not frontend visibility, enforce permissions.

See [backend boundaries](./docs/backend-boundaries.md), [environment docs](../../docs/env.md), and [access-control docs](../../docs/access-control.md).
