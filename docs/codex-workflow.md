# Codex Workflow

## Default flow

Use `$deliver-swiss-card` for a card, issue, feature, bug, or scoped refactor.

```text
scope -> implement -> validate -> handoff
```

For small, clear work, implementation can begin after the scope map. For broad, ambiguous, or cross-application work, use `spec-scout` first and write a bounded plan. Do not stop merely to request approval unless an unresolved decision materially changes behavior, data, permissions, contracts, migrations, or public API.

## Agents

- `spec-scout`: read-only requirements, impact, risks, and criterion-to-validation map.
- `implementer`: workspace-write implementation within approved scope.
- `validator`: independent validation without source edits.
- `critical-reviewer`: read-only, high-risk review for auth, authorization, cookies, Prisma, contracts, CI, destructive operations, or broad diffs.

For broad work, use `spec-scout -> implementer -> validator`. Add `critical-reviewer` only when the risk calls for it. Do not run overlapping write agents.

## Validation

Use `$validate-change` before completion. The receipt must distinguish commands that passed, failed, or did not run; map acceptance criteria to evidence; list findings; and state residual risk.

Typical validation:

```bash
# Web
pnpm lint:web
pnpm typecheck:web
pnpm test:web

# API
pnpm lint:api
pnpm typecheck:api
pnpm test:api

# Cross-workspace or high risk
pnpm lint:ci
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

## Handoff

Report the covered acceptance criteria, changed files and behavior, validation receipt, review findings, remaining risks, and required manual checks. Git commits, pushes, pull requests, and merges remain explicit user actions.
