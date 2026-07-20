# Swiss Kit Core repository instructions

Swiss Kit Core is a pnpm TypeScript monorepo and reusable baseline for web systems. Keep it generic: do not reintroduce finance-domain behavior or product-specific structure.

## Structure

- `apps/web`: React + Vite frontend. Dependency flow: `src/app -> src/modules -> src/features -> src/shared`.
- `apps/api`: NestJS API. Dependency flow: `controller -> service -> repository/prisma`.
- `packages/contracts`: shared Zod schemas and API-facing types only.

Read this file first, then the nearest scoped `AGENTS.md` before changing a directory. Read relevant architecture docs and existing code patterns before introducing structure.

## Core rules

- Use pnpm from the repository root and Node 24.
- Keep `apps/web`, `apps/api`, and `packages/contracts` boundaries intact.
- Prefer small, local, reversible changes. Preserve unrelated user changes.
- Add dependencies only with a task-specific justification.
- Do not invent business rules or silently break public API contracts.
- Do not commit, push, open pull requests, merge, or mutate external systems unless explicitly asked.
- Never commit real `.env` files, credentials, or secret values.

## Swiss Kit baseline

Use neutral Core names such as `auth`, `users`, `access-control`, `settings`, `files`, and `notifications`. Do not turn the baseline into a mandatory enterprise product: tenant isolation, Redis sessions, S3, email, and customer-specific modules require explicit scope.

For frontend work, preserve module ownership, route registration, permission metadata, existing HTTP/query helpers, and the rule that frontend access-control is UX only.

For API work, keep controllers thin, services responsible for use cases, repositories responsible for Prisma, DTOs explicit, and environment access centralized.

For shared contracts, update schemas, API mappings, and web consumers together. Shared contract changes are high risk.

## Delivery and validation

Use `$deliver-swiss-card` for cards, features, bugs, and scoped delivery work. It maps requirements to implementation and validation without a mandatory planning stop.

Use `$validate-change` before claiming completion. For high-risk work—authentication, authorization, cookies, Prisma migrations, public contracts, environment, CI, destructive actions, or broad cross-application changes—also use `critical-reviewer`.

For broad or ambiguous scope, use `spec-scout -> implementer -> validator`; do not delegate trivial work or run overlapping write agents.

Use `$caveman` for routine concise communication. Before noisy read-only or validation commands such as lint, typecheck, tests, builds, `git status`, or dependency listings, use `$rtk`; rerun raw commands on failure or when exact output is needed.

## Commands

- Web: `pnpm lint:web`, `pnpm typecheck:web`, `pnpm test:web`; add `pnpm test:web:e2e` for browser-sensitive changes.
- API: `pnpm lint:api`, `pnpm typecheck:api`, `pnpm test:api`.
- Cross-workspace, contracts, Prisma, auth, authorization, CI: `pnpm lint:ci`, `pnpm typecheck`, `pnpm test:ci`, `pnpm build:ci`.

If a relevant command does not run, record the exact reason and residual risk.

## Sensitive areas

Require stronger review for authentication, authorization, access-control, JWT, cookies, CORS, Google OAuth, allowed emails, contracts, Prisma schema/migrations, environment validation, CI, secrets, logging, file uploads, and future multi-tenant behavior.
