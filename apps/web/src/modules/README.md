# Frontend Modules

Modules own page-level composition for the web app.

Current routeable modules are:

- `core`
- `auth`
- `users`
- `access-control`
- `settings`
- `access-list` (route/capability `allowed-emails`)
- `tasks` (Reference / Implemented)

`settings` is Core / Partial. Files and notifications are Optional / Not implemented; multi-tenancy is Out of scope / Not implemented. See [the runtime matrix](../../../../docs/current/capability-matrix.md).

## Responsibilities

A module may own:

- route pages;
- page-specific layout;
- module-only components;
- module-only hooks;
- composition of feature-level building blocks.

A module should not own reusable domain primitives that need to be shared across multiple modules. Move those to `src/features/<feature>`.

## Expected shape

```text
src/modules/<module>/
  pages/
    <ModulePage>.tsx
  components/
    <ModuleOnlyComponent>.tsx
  hooks/
    use-module-page-state.ts
  README.md
```

## Boundaries

Allowed:

- modules may import from `src/features/*`;
- modules may import from shared layers such as `src/components`, `src/lib`, `src/auth` and API helpers;
- modules may compose page-level behavior.

Avoid:

- importing from another module directly;
- placing product-specific components in `src/components`;
- adding routes without updating the app navigation contract;
- creating shared abstractions before they have real reuse.

## Route registration

Routes and navigation should be wired from the app layer:

- `src/app/routes/AppRoutes.tsx`
- `src/app/navigation/modules.ts`

Do not hide route registration inside a module without a clear architectural decision.
