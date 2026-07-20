# Module Authoring Guide

This guide describes how to add frontend modules to Swiss Kit without weakening the template architecture.

Use this when creating a new area such as `users`, `access-control`, `settings`, `files` or another reusable template module.

Check the repository [capability matrix](../../../docs/current/capability-matrix.md) first. `files` and `notifications` are Optional / Not implemented; multi-tenancy is Out of scope / Not implemented.

## Goal

A module should be easy to remove, replace or promote into an optional preset.

A good module:

- has a clear route;
- owns its page-level composition;
- keeps reusable domain behavior in features;
- does not leak product-specific code into shared folders;
- uses shared contracts when calling the API;
- has a small and explicit navigation entry.

## Recommended structure

```text
src/modules/<module>/
  pages/
    <ModulePage>.tsx
  components/
    <ModuleOnlyComponent>.tsx
  hooks/
    use-module-page-state.ts
  README.md

src/features/<feature>/
  components/
    <FeatureWidget>.tsx
  hooks/
    use-feature-query.ts
  services/
    feature-service.ts
  types.ts
  index.ts
```

Use `src/modules/<module>` when the code is only useful for that module page.

Use `src/features/<feature>` when the behavior can be reused by more than one module or route.

Use `src/components` only for generic UI that has no domain-specific meaning.

## Route wiring

New modules should be wired through the app layer.

Checklist:

1. Create the page under `src/modules/<module>/pages`.
2. Register the path in `src/app/navigation/modules.ts`.
3. Add a navigation item to `APP_MODULES` only when the module should be visible in the shell.
4. Wire the protected route in `src/app/routes/AppRoutes.tsx`.
5. Keep auth/public-only logic in the app routing layer.

## Data access

Prefer this flow:

```text
module page -> feature hook/service -> shared API client -> API contract
```

Avoid calling `fetch` directly from pages.

When the API already exposes a shared contract, use the contract to validate the response before rendering user-facing state.

## Naming rules

Prefer generic template names:

- `users`
- `access-control`
- `settings`
- `files`
- `notifications`
- `core`

Avoid names tied to one product, one client or one legacy domain.

## What not to do

Do not:

- add product-specific widgets to `src/components`;
- import from `src/modules/*` inside `src/features/*`;
- bypass `src/app/navigation/modules.ts` for shell navigation;
- add a route without deciding whether it belongs to the Core template or to an optional preset;
- reintroduce removed finance-domain code;
- create a shared abstraction before there are at least two real consumers.

## Validation

For module-only changes, start with:

```bash
pnpm lint:web
pnpm typecheck:web
```

For changes that touch API contracts or shared packages, also run:

```bash
pnpm typecheck
pnpm test:ci
```

For navigation, protected routes or auth-sensitive UI, consider:

```bash
pnpm test:web:e2e
```
