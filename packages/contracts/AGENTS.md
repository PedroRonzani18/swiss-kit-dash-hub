# Contracts AGENTS.md

## Scope

These instructions apply to `packages/contracts`.

Read this file before changing shared schemas, shared types, public API response shapes or frontend/backend boundary contracts.

Also read:

- root `AGENTS.md`
- `docs/template.md`
- `docs/module-authoring.md` when adding module contracts
- `docs/codex-workflow.md` when working through the Codex pipeline

## Purpose

`packages/contracts` is the shared contract surface between the API and the web app.

It should reduce drift between frontend and backend by centralizing:

- Zod schemas;
- inferred TypeScript types;
- shared identifiers;
- API response shapes;
- permission keys and module metadata contracts when they cross app boundaries.

Keep this package generic and template-friendly.

## Contract rules

Shared contracts should be added when:

- both frontend and backend need the same response shape;
- frontend validates API responses with Zod;
- a module exposes a public cross-workspace shape;
- auth/user/session data crosses the API/web boundary;
- permission keys or module registration metadata need shared typing.

Shared contracts should not be added when:

- the type is private to one implementation file;
- the type describes an internal Prisma query detail;
- the shape is product-specific and not part of the template baseline;
- the task has not defined the API boundary yet.

## Naming conventions

Use neutral names:

```text
Auth
CurrentUser
Permission
Role
Module
Pagination
ApiError
Health
```

Avoid customer, company or product-specific names.

Prefer explicit schema/type pairs:

```ts
export const CurrentUserSchema = z.object({ ... });
export type CurrentUser = z.infer<typeof CurrentUserSchema>;
```

## Zod conventions

- Export schemas and inferred types together.
- Keep schemas serializable and API-oriented.
- Avoid importing app-specific code from `apps/*`.
- Do not encode UI-only concerns in shared contracts.
- Keep transforms minimal. Prefer clear API mapping in the API or web service layer.

## Permission contracts

Permission keys should follow:

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

Do not invent new action names without a clear reason. Prefer the common actions until the product proves a need for more granularity.

## Compatibility

Contract changes are high risk because they can break both apps.

When changing a contract:

1. Update the shared schema/type.
2. Update API mappers and response DTOs.
3. Update frontend parsing and consumers.
4. Update tests or validation notes.
5. Run monorepo typecheck.

Do not make breaking changes silently. If a breaking change is necessary, document it in the PR body.

## Validation

For contract-only changes, run:

```bash
pnpm typecheck
pnpm test:ci
```

For changes consumed by runtime code, also run:

```bash
pnpm build:ci
```

If validation cannot run, record the exact reason.
