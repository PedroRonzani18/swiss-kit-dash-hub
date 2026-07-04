# Frontend Features

Features own reusable domain behavior for the web app.

Use this directory when code is more specific than shared UI, but more reusable than a single route page.

Examples:

- user queries and user cards;
- access-control permission selectors;
- file upload widgets;
- notification hooks;
- reusable settings forms.

## Responsibilities

A feature may own:

- domain-specific components;
- hooks;
- API services;
- query keys;
- local feature types;
- feature-level tests;
- an `index.ts` public surface.

## Expected shape

```text
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

## Boundaries

Allowed:

- features may import from shared layers such as `src/components`, `src/lib`, `src/auth` and API helpers;
- features may import shared contracts from workspace packages;
- modules may import features.

Not allowed:

- features must not import from `src/modules/*`;
- features must not own app routing;
- features must not mutate global navigation directly;
- features should not know about page-level layout.

## Public surface

Prefer exposing a small public surface from `index.ts` instead of forcing consumers to import deep internal files.

Good:

```ts
import { UserCard } from "@/features/users";
```

Avoid when possible:

```ts
import { UserCard } from "@/features/users/components/UserCard";
```

## When not to create a feature

Do not create a feature for one tiny page-only component. Keep it inside the module until there is a real reuse or separation need.
