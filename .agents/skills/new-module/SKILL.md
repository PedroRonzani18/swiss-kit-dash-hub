---
name: new-module
description: Guide creation of a generic Swiss Kit module using the repository scaffold, module authoring rules, and proportional validation.
argument-hint: "<module-id> [frontend-only|api-only|full-stack]"
disable-model-invocation: true
---

# New Module

Create or plan a generic Swiss Kit module with the smallest safe workflow for its risk level.

Use this skill when the user asks to add, scaffold, or plan a new module.

## Required reading

Before acting:

1. Read the root `AGENTS.md`.
2. Read `docs/module-authoring.md`.
3. Read `docs/codex-workflow.md`.
4. Read scoped instructions for every touched area:
   - `apps/web/AGENTS.md` for frontend module work.
   - `apps/api/AGENTS.md` for backend module work.
   - `packages/contracts/AGENTS.md` for shared contracts.

## Flow selection

Use direct work only for a frontend shell module with clear scope and no sensitive areas.

Use `$ship` or an explicit approved plan when the module touches:

- authentication or authorization;
- access-control or permissions;
- shared contracts;
- Prisma schema or migrations;
- backend API behavior;
- CI or deployment;
- broad template direction.

Do not infer permissions, contracts, persistence, or business rules during implementation. If those are unclear, stop with `OPEN QUESTIONS`.

## Module ID rules

The module ID must:

- be generic and template-friendly;
- match `^[a-z][a-z0-9-]*$`;
- avoid client-specific, finance-domain, or legacy product names.

Good examples:

```text
users
settings
access-control
files
notifications
tasks
```

## Frontend scaffold

For frontend shell work, use the repository scaffold:

```bash
pnpm scaffold:module <module-id>
```

The scaffold creates:

```text
apps/web/src/modules/<module>/pages/<Module>Page.tsx
apps/web/src/features/<module>/hooks/use<Module>Overview.ts
apps/web/src/api/<module>.ts
```

After running it, register the module in:

```text
apps/web/src/app/navigation/modules.ts
```

Add route wiring if the current app route structure requires it. Read existing routes before editing.

## Checklist

Before implementation, decide:

- frontend route and navigation label;
- whether API routes are needed;
- whether shared contracts are needed;
- whether permissions are needed;
- whether persistence or Prisma changes are needed;
- docs that need updates;
- validation commands.

During implementation:

- keep frontend code under `apps/web/src/modules/<module>` and `apps/web/src/features/<module>`;
- keep backend code under `apps/api/src/modules/<module>`;
- keep shared contracts under `packages/contracts`;
- preserve dependency direction from app to modules to features/shared/contracts;
- avoid product-specific naming.

## Validation

Use the narrowest relevant validation first.

Frontend-only:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
```

API-only:

```bash
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

Full-stack or contracts:

```bash
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

Record any command that could not run and the remaining risk.
