# Local setup

Use Node.js 24 (pinned in `.node-version`) and pnpm 10.33.0 (pinned in `package.json`). `pnpm bootstrap` verifies the required pnpm version and runs its child package-manager commands through Corepack.

1. Install dependencies and generate the API Prisma client:

   ```bash
   pnpm bootstrap
   ```

2. `pnpm bootstrap` creates `apps/web/.env.local` and `apps/api/.env` from the checked-in examples only when they are absent. It never overwrites existing local environment files. Review their values before starting services.

3. Start the persistent local PostgreSQL service and apply local migrations:

   ```bash
   pnpm db:up
   pnpm db:migrate
   pnpm db:seed
   ```

4. Start the applications:

   ```bash
   pnpm dev
   ```

The web runs at `http://localhost:8080`; the API runs at `http://localhost:3001/api`; Swagger is at `http://localhost:3001/api/docs`.

Set the required API runtime variables before starting. `INITIAL_ADMIN_EMAIL` is optional and affects only `pnpm db:seed`: it may create a new active administrator when no matching user exists. Runtime never reads it. See [environment configuration](../env.md).

For command behavior, database safety notes, and validation gates, see the [command reference](../reference/scripts.md).
