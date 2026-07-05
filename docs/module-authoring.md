# Module Authoring

## Purpose

This guide defines how new modules should be planned and added to Swiss Kit.

A module should be a vertical slice with clear ownership across frontend, backend and contracts when needed.

## Module decision checklist

Before creating a module, answer:

- What problem does the module solve?
- Is it part of the reusable Core template?
- Does it need API routes?
- Does it need frontend routes?
- Does it need shared contracts?
- Does it need permissions?
- Does it require Prisma schema changes?
- Which validation commands should run?

If a module requires auth, permissions, contracts or migrations, the Planner should call that out explicitly before implementation.

## Naming

Use neutral names.

Good examples:

```text
users
settings
access-control
files
notifications
tasks
```

Avoid client-specific, product-specific or legacy domain names in Core.

## Frontend module shape

Recommended location:

```text
apps/web/src/modules/<module>/
  pages/
  components/
  hooks/
  services/
  module.definition.ts
```

Frontend module rules:

- pages live under `src/modules/<module>/pages`;
- module-local components stay under `src/modules/<module>/components`;
- reusable behavior can move to `src/features/<feature>` only when another module can reuse it;
- route and navigation metadata should be registered through the app shell;
- module access should use permission metadata when access-control is required.

Expected dependency direction:

```text
src/app -> src/modules -> src/features -> src/shared
```

## Backend module shape

Recommended location:

```text
apps/api/src/modules/<module>/
  <module>.module.ts
  <module>.controller.ts
  <module>.service.ts
  repositories/
    <module>.repository.ts
  dto/
    create-<resource>.dto.ts
    update-<resource>.dto.ts
  mappers/
    <resource>.mapper.ts
```

Backend module rules:

- controllers define HTTP and delegate to services;
- services coordinate use cases and business rules;
- repositories wrap Prisma access;
- DTOs validate incoming payloads;
- mappers isolate response shape mapping when needed.

Expected dependency direction:

```text
controller -> service -> repository -> PrismaService
```

## Shared contracts

Add contracts under `packages/contracts` when frontend and backend need the same shape.

Recommended pattern:

```ts
export const ExampleSchema = z.object({
  id: z.string(),
});

export type Example = z.infer<typeof ExampleSchema>;
```

Contract rules:

- keep names generic;
- export schemas and inferred types together;
- avoid UI-only concerns;
- avoid Prisma-specific implementation details;
- update both API and web consumers when the contract changes.

## Permissions

When a module needs access-control, use permission keys with this format:

```text
<module>:<action>
```

Common actions:

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

Use `access` to control whether the module appears in navigation or can be opened.

Use `manage` for high-level admin behavior when finer-grained CRUD permissions are unnecessary.

Do not create very granular permission keys until there is a real use case.

## Implementation checklist

For a new full-stack module:

1. Add shared contracts if needed.
2. Add backend module structure.
3. Add DTOs and mappers.
4. Add frontend service/hooks/pages.
5. Register routes/navigation.
6. Add permissions if required.
7. Update docs.
8. Run relevant validation.

## Validation checklist

Frontend-only module work:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
```

API-only module work:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

Full-stack or contracts work:

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

Record any command that could not run and why.
