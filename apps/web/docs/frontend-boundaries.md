# Frontend Boundaries

This document defines import boundaries for the web app to keep modules decoupled and maintenance predictable.

## Layer direction

- `src/app` can orchestrate routes, providers, and global shell.
- `src/modules/*` can compose pages and module-specific UI.
- `src/features/*` can expose domain UI/data building blocks.
- `src/components/*`, `src/lib/*`, `src/auth/*` are shared layers.

Practical rule:

- if a component is specific to one domain (for example finance), keep it inside that feature/module namespace instead of `src/components`.

Recommended dependency flow:

`app -> modules -> features -> shared`

## Enforced lint guardrails

`apps/web/eslint.config.js` enforces:

- Only `src/components/ui` can import `@radix-ui/*` directly.
- `src/components/finance/*` imports are blocked (finance domain components must stay in `src/features/finance/components/*`).
- `src/features/*` cannot import from `src/modules/*`.
- Modules cannot import from other modules.
- `animes`, `tools`, and `settings` modules cannot import from `src/features/*` directly.

## Finance navigation contract

Finance route/tab mapping lives in:

- `src/features/finance/navigation.ts`

Reason:

- both feature components and shell-level components (for example command palette) consume the same route contract.
- keeping this mapping in `features/finance` avoids a reverse dependency from features to module pages.
