# Frontend Boundaries

This document defines import boundaries for the web app to keep modules decoupled and maintenance predictable.

## Layer direction

- `src/app` can orchestrate routes, providers, and global shell.
- `src/modules/*` can compose pages and module-specific UI.
- `src/features/*` can expose domain UI/data building blocks.
- `src/components/*`, `src/lib/*`, `src/auth/*` are shared layers.

Practical rule:

- if a component is specific to one domain, keep it inside that feature/module namespace instead of `src/components`.
- deleted legacy modules must not be reintroduced as shared components.

Recommended dependency flow:

`app -> modules -> features -> shared`

## Enforced lint guardrails

`apps/web/eslint.config.js` enforces:

- Only `src/components/ui` can import `@radix-ui/*` directly.
- domain-specific shared component folders under `src/components/*` are blocked.
- `src/features/*` cannot import from `src/modules/*`.
- Module boundaries stay centralized in `src/app` and page-level modules under `src/modules/*`.

## Core navigation contract

Current shell entrypoints:

- `/` redirects by auth state.
- `/login` is public-only.
- `/app` is the protected neutral Core shell.
- `/financeiro/*` is a protected legacy redirect to `/app`.

Reason:

- the shell owns default routing and navigation during the transition;
- command palette and sidebar must expose only active Core navigation.
- the removed finance frontend must not be reintroduced through shared components or aliases.
