# Settings Module

This module is a neutral template shell for application settings.

It exists as the current partial Core settings slice:

- route path registered in `src/app/navigation/modules.ts`;
- protected route wired in `src/app/routes/AppRoutes.tsx`;
- page component owned by `src/modules/settings/pages`;
- no product-specific behavior;
- protected API overview at `GET /api/settings`;
- no persistence dependency.

## Current scope

The current API response and page are intentionally static.

It only reserves UI space for future generic settings areas:

- account;
- preferences;
- system.

## Out of scope

This module does not currently include:

- persisted settings;
- user profile editing;
- role or permission management;
- tenant or organization settings.

Those capabilities should be introduced through separate specs and PRs.
