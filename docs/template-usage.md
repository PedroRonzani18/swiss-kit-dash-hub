# Template Usage

Swiss Kit Core is a template-core for new internal systems.

Check [docs/current](./current/README.md) first: `tasks` is **Reference / Implemented**, while files and notifications are Optional / Not implemented and multi-tenancy is Out of scope / Not implemented.

Use it when you need:

- Google OAuth authentication;
- cookie-based API sessions;
- shared contracts between API and web;
- local access-control;
- a protected React shell;
- a repeatable module pattern.

## Create a new module

Start with the scaffold:

```bash
pnpm scaffold:module -- my-module --type full-stack
```

Supported types are `web-only`, `api-only`, `contracts-only`, and `full-stack`. The scaffold creates only local starter files. It never registers routes, navigation, API modules, permissions, or contract barrel exports; make those decisions as part of the feature implementation.

Then complete the module by adding only what the feature needs:

1. shared contract in `packages/contracts/src/<module>.ts`;
2. API module in `apps/api/src/modules/<module>`;
3. web API client in `apps/web/src/api/<module>.ts`;
4. query hook in `apps/web/src/features/<module>/hooks`;
5. page in `apps/web/src/modules/<module>/pages`;
6. registry entry in `apps/web/src/app/navigation/modules.ts`;
7. permission keys in `packages/contracts/src/access-control-catalog.ts` when the module is protected.

## Example module

The `tasks` module is intentionally simple and static.

It demonstrates the expected flow:

```text
packages/contracts/src/tasks.ts
apps/api/src/modules/tasks
apps/web/src/api/tasks.ts
apps/web/src/features/tasks/hooks/useTasksOverview.ts
apps/web/src/modules/tasks/pages/TasksPage.tsx
apps/web/src/app/navigation/modules.ts
```

Use it as a copyable reference, not as product functionality.

## Access-control flow

For protected modules:

1. Add `<module>:access` for shell access.
2. Add action permissions such as `<module>:read` or `<module>:manage`.
3. Seed permissions with `pnpm --filter api prisma:seed`.
4. Use `requiredPermissions` in the web module registry.
5. Use `@RequirePermissions(...)` in API controllers.

The frontend filter is UX only. API guards remain the security boundary.

## What not to add to Core by default

Keep these as optional presets or product-specific extensions:

- Redis sessions;
- S3/file storage;
- email delivery;
- complex role management UI;
- client-specific modules.

Multi-tenancy is not an optional preset in the current baseline: it is **Out of scope / Not implemented** and requires an explicit architectural decision before work begins.
