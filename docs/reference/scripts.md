# Command reference

This is the source of truth for repository commands. Run commands from the repository root with Node.js 24 and pnpm 10.33.0.

## Setup and development

| Command | Purpose |
| --- | --- |
| `pnpm bootstrap` | Verifies pnpm 10.33.0 and runs child commands through explicit Corepack invocations, creates missing local environment files without overwriting existing files, installs the frozen lockfile, and generates the API Prisma client. This name avoids pnpm's built-in `setup` command. |
| `pnpm dev` | Starts API and web development processes. |
| `pnpm dev:web` | Starts only the Vite web app. |
| `pnpm dev:api` | Starts only the Nest API. |

## Local database

| Command | Purpose |
| --- | --- |
| `pnpm db:up` | Starts the persistent local PostgreSQL Compose service. |
| `pnpm db:down` | Stops the persistent local PostgreSQL Compose service. |
| `pnpm db:status` | Shows local PostgreSQL Compose status. |
| `pnpm db:logs` | Follows local PostgreSQL Compose logs. |
| `pnpm db:migrate` | Runs Prisma development migrations against the configured local `DATABASE_URL`. |
| `pnpm db:seed` | Seeds the configured local `DATABASE_URL`. |

`db:migrate` and `db:seed` are local-development operations. Confirm `DATABASE_URL` before running them; they do not use the isolated verification database.

## Validation

| Command | Purpose |
| --- | --- |
| `pnpm check` | Docker-free lint, typecheck, Prisma generation, script tests, web tests, and API unit tests. |
| `pnpm verify` | Owns an isolated PostgreSQL Compose project, runs unit and API integration tests, web E2E tests, and production builds, then removes its containers and volumes. |
| `pnpm test:scripts` | Runs safe Node tests for repository scripts. |

Install the Playwright browser before the first local `pnpm verify`:

```bash
pnpm --filter web exec playwright install chromium
```

For focused commands, use the root `lint:*`, `typecheck:*`, `test:*`, and `build:*` aliases in `package.json`.
