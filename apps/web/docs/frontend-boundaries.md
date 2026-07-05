# Frontend Boundaries

This document defines import and ownership boundaries for the web app to keep modules decoupled, template-friendly and predictable to maintain.

The current frontend should behave as a neutral Core shell. Product-specific modules can be added later, but they must enter through explicit module registration instead of leaking into shared layers.

## Layer direction

Recommended dependency flow:

```text
app -> modules -> features -> shared
```

Layer responsibilities:

- `src/app` owns app-wide orchestration: routes, providers, shell wiring, module registration and navigation composition.
- `src/modules/*` owns page-level module composition: route pages, module layouts and module-specific orchestration.
- `src/features/*` owns reusable feature behavior: feature UI, hooks, services and data access that can be consumed by modules.
- `src/components/*` owns generic reusable UI only.
- `src/lib/*`, `src/auth/*` and other shared layers own cross-cutting utilities.

## Ownership rules

Practical rules:

- If a component is specific to one domain, keep it inside that domain module or feature namespace instead of `src/components`.
- If a hook or service depends on a domain concept, keep it in `src/features/<feature>` or `src/modules/<module>`.
- If something is generic enough for multiple unrelated modules, it may live in `src/components`, `src/lib` or another shared layer.
- Deleted legacy modules must not be reintroduced as shared components.
- Product-specific modules must not become part of the Core shell by accident.

## Route ownership

Routes are rendered by `src/app/routes/AppRoutes.tsx` from the declarative registry in `src/app/navigation/modules.ts`.

Current shell entrypoints:

- `/` redirects by auth state.
- `/login` is public-only.
- `/app` is the protected neutral Core shell.
- `*` falls through to the Not Found page.

Module paths, navigation metadata, route components and future permission metadata are centralized in `src/app/navigation/modules.ts`.

When adding a module route:

1. Add or update the module definition in `src/app/navigation/modules.ts`.
2. Set `nav: true` only if it should appear in shell navigation and command palette.
3. Keep the page component under `src/modules/<module>/pages`.
4. Add `requiredPermissions` when access-control is implemented for the module.
5. Keep reusable domain behavior under `src/features/<feature>` when it can be shared by more than one page.

## Enforced lint guardrails

`apps/web/eslint.config.js` enforces:

- Only `src/components/ui` can import `@radix-ui/*` directly.
- Domain-specific shared component folders under `src/components/*` are blocked by convention and should not be recreated.
- `src/features/*` cannot import from `src/modules/*`.
- Module boundaries stay centralized in `src/app` and page-level modules under `src/modules/*`.

These lint rules are guardrails, not the entire architecture. A change can pass lint and still be wrong if it moves domain-specific behavior into shared folders.

## Module creation checklist

Before adding a new frontend module, answer:

- What route should expose the module?
- Should it appear in shell navigation?
- Is the module generic enough for the template baseline, or should it be an optional preset/example?
- Which code belongs to `src/modules/<module>`?
- Which code belongs to `src/features/<feature>`?
- Are any shared components truly generic?
- What API contracts does the module consume?
- Which tests or validation commands should be run?

## Template safety rules

Because Swiss Kit is meant to become a reusable template:

- Prefer neutral names such as `core`, `users`, `access-control`, `settings`, `files` and `notifications`.
- Avoid client-specific, company-specific or product-specific names in the Core shell.
- Do not copy a full product module from another system into the template baseline.
- Treat product modules as optional presets unless they are required by the Core template.
- Do not reintroduce finance-domain routes, contracts or navigation as active implementation.

## Core navigation contract

Reason:

- the shell owns default routing and navigation for the template baseline;
- command palette and sidebar must expose only active Core navigation;
- domain-specific legacy modules must not be reintroduced through shared components or aliases.
