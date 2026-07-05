# Web AGENTS.md

## Scope

These instructions apply to `apps/web`.

Read this file before changing frontend routes, modules, shell composition, auth state, query behavior, UI primitives or frontend API consumption.

Also read:

- root `AGENTS.md`
- `apps/web/docs/frontend-boundaries.md`
- `docs/template.md` when changing template behavior
- `docs/module-authoring.md` when creating or changing a module
- `docs/codex-workflow.md` when working through the Codex pipeline

## Frontend architecture

The web app is a neutral Core shell. Keep product-specific behavior out of shared layers.

Expected dependency flow:

```text
src/app -> src/modules -> src/features -> src/shared
```

Layer ownership:

- `src/app`: app-wide routes, providers, shell wiring, module registration and navigation composition.
- `src/modules/*`: page-level module composition and route pages.
- `src/features/*`: reusable domain behavior, hooks, services and feature UI.
- `src/components/*`: generic reusable UI only.
- `src/components/ui/*`: low-level UI primitives and direct Radix integration.
- `src/shared/*`: HTTP, query, utilities, cross-cutting helpers and generic types.

Do not move module-specific behavior into `src/components`, `src/lib` or `src/shared` just to make imports easier.

## Module rules

When adding or changing a module:

1. Keep route pages under `src/modules/<module>/pages`.
2. Keep module-local components under `src/modules/<module>/components`.
3. Keep reusable feature behavior under `src/features/<feature>` only when another module can reasonably reuse it.
4. Register routes and navigation through the app-level module/route registry.
5. Add or update required permissions when the module should be protected by access-control.
6. Update `docs/module-authoring.md` if the module pattern changes.

A module should declare only what the shell needs to know: route, label, navigation metadata and required permissions.

## Access-control expectations

Frontend access-control is user-experience only. The backend is the source of truth for security.

Frontend code may:

- hide navigation items the user cannot access;
- hide or disable actions the user cannot perform;
- redirect from protected module routes;
- use permission helpers such as `can(...)` or `canAccessModule(...)` when they exist.

Frontend code must not:

- rely on hidden buttons as the only protection;
- hardcode admin-only behavior outside permission helpers;
- invent permission keys without updating shared contracts and backend registration;
- duplicate backend authorization rules in ad-hoc page logic.

Recommended permission key format:

```text
<module>:<action>
```

Examples:

```text
users:access
users:create
settings:access
access-control:manage
```

## Data fetching and contracts

Prefer existing HTTP/query helpers before creating new ones.

When consuming API data:

- use TanStack Query for server state;
- centralize query keys when the data is reused;
- validate responses with `@swisskit/contracts` when a shared schema exists;
- keep endpoint-specific mapping near the service/hook that consumes it;
- avoid leaking raw API response quirks into UI components.

Do not add Axios or another HTTP dependency unless the task explicitly asks for that and explains why the existing client is insufficient.

## UI rules

- Prefer existing UI primitives before creating new ones.
- Only `src/components/ui` should import Radix primitives directly.
- Keep product-specific UI copy and domain components inside modules/features.
- Do not add theme or design-system changes as part of unrelated work.

## Auth-sensitive frontend changes

Treat these as high risk:

- login/logout flow;
- auth callback handling;
- `AuthProvider` behavior;
- protected routes;
- cookie/session assumptions;
- user profile shape from `/auth/me`;
- permission-aware navigation.

For these changes, update docs and include validation notes.

## Validation

For frontend-only changes, start with:

```bash
pnpm lint:web
pnpm typecheck:web
pnpm test:web
```

For route, shell or E2E-sensitive changes, also run:

```bash
pnpm test:web:e2e
```

For shared contracts or cross-workspace changes, also run from the root:

```bash
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

If validation cannot run, record the exact reason.
