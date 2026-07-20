# Module Authoring

## Purpose

This guide defines how new modules should be planned and added to Swiss Kit.

A module should be a vertical slice with clear ownership across frontend, backend and contracts when needed.

## Fast start

Use the scaffold for the local starter files:

```bash
pnpm scaffold:module -- <module-id> --type <web-only|api-only|contracts-only|full-stack>
```

Example:

```bash
pnpm scaffold:module -- tasks --type full-stack
```

The scaffold creates only the selected local files:

```text
apps/web/src/modules/<module>/pages/<Module>Page.tsx
apps/api/src/modules/<module>/<module>.{controller,service,module}.ts
packages/contracts/src/<module>.ts
```

It does not modify route/navigation registries, API module imports, permissions, or contract barrel exports. Add only the required registrations after implementing the feature.

Use the `tasks` module as the full-stack reference implementation.

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

If a module requires auth, permissions, contracts, or migrations, make those decisions explicit in the scope map before implementation. Ask for a human decision only when the request leaves a material choice unresolved.

Start module work with:

```text
$deliver-swiss-card Implement <module-id> as a generic Swiss Kit module
```

For a broad module, use `spec-scout` to map affected layers and validation. Validate the finished change with `$validate-change`; add `critical-reviewer` for sensitive work.

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

Current classification matters: `tasks` is Reference / Implemented; `settings` is Core / Partial; `files` and `notifications` are Optional / Not implemented. Multi-tenancy is Out of scope / Not implemented.

Avoid client-specific, product-specific or legacy domain names in Core.

## Frontend module shape

Recommended location:

```text
apps/web/src/modules/<module>/
  pages/
  components/
```

Reusable feature behavior should live under:

```text
apps/web/src/features/<module>/
  hooks/
```

Endpoint-specific API clients should live under:

```text
apps/web/src/api/<module>.ts
```

Frontend module rules:

- pages live under `src/modules/<module>/pages`;
- module-local components stay under `src/modules/<module>/components`;
- reusable behavior can move to `src/features/<feature>` only when another module can reuse it;
- route and navigation metadata should be registered through the app shell;
- module access should use permission metadata when access-control is required.

Expected dependency direction:

```text
src/app -> src/modules -> src/features -> src/api/contracts/shared
```

## Backend module shape

Recommended location:

```text
apps/api/src/modules/<module>/
  <module>.module.ts
  <module>.controller.ts
  <module>.service.ts
  <module>.dto.ts
```

For persisted modules, add repositories/mappers as needed:

```text
repositories/
  <module>.repository.ts
mappers/
  <resource>.mapper.ts
```

Backend module rules:

- controllers define HTTP and delegate to services;
- services coordinate use cases and business rules;
- repositories wrap Prisma access when persistence exists;
- DTOs describe/validate incoming and outgoing HTTP payloads;
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

export type ExampleContract = z.infer<typeof ExampleSchema>;
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
tasks:read
```

Use `access` to control whether the module appears in navigation or can be opened.

Use `manage` for high-level admin behavior when finer-grained CRUD permissions are unnecessary.

Do not create very granular permission keys until there is a real use case.

## Implementation checklist

For a new full-stack module:

1. Run the scaffold when creating web shell files.
2. Add shared contracts if needed.
3. Add backend module structure.
4. Add DTOs and mappers.
5. Add frontend API client/hooks/pages.
6. Register routes/navigation.
7. Add permissions if required.
8. Update docs.
9. Run relevant validation.

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
