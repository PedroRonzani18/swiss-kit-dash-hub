---
name: create-migration
description: Guide high-risk Prisma schema and migration work with explicit approval, migration-history safety, and database-backed validation.
argument-hint: "<change request>"
disable-model-invocation: true
---

# Create Migration

Plan and execute Prisma schema or migration work for Swiss Kit.

Use this skill whenever a task touches:

- `apps/api/prisma/schema/**`;
- `apps/api/prisma/migrations/**`;
- Prisma-generated types;
- persistence fields that affect API or contract behavior.

## Required reading

Before acting:

1. Read the root `AGENTS.md`.
2. Read `apps/api/AGENTS.md`.
3. Read `docs/ai/security.md`.
4. Read `docs/ai/testing.md`.
5. Read current Prisma schema files under `apps/api/prisma/schema`.
6. Read existing migration names under `apps/api/prisma/migrations`.

Read `packages/contracts/AGENTS.md` when schema fields cross the frontend/backend boundary.

## Flow requirement

Prisma schema and migration work is sensitive.

Use `$ship` or an explicit approved plan before implementation. The plan must state:

- objective;
- affected schema files;
- expected migration name;
- whether data loss is possible;
- seed changes, if any;
- contract/API/frontend impact;
- validation commands;
- rollback or reprovisioning notes.

Do not implement while `OPEN QUESTIONS` remain.

## Hard rules

- Never edit an existing migration file to change history.
- Never delete a migration unless the user explicitly asks for migration-history cleanup.
- Never hide destructive migration behavior.
- Never use a real or shared database for migration experiments.
- Never commit secrets or real connection strings.
- Keep Core generic and template-friendly.
- Do not add product-specific tables to the Core baseline.

Existing migrations may be read for context. New migration directories may be created only after the schema plan is approved.

## Implementation checklist

Before editing schema:

- identify the owning schema file under `apps/api/prisma/schema`;
- check whether the change needs contracts or DTO updates;
- check whether seed data must change;
- decide whether the migration is additive, destructive, or data-transforming.

When creating a migration:

```bash
pnpm --filter api prisma:migrate:dev --name <migration-name>
```

Use a local or disposable database. If no disposable database is available, stop and report the validation gap.

After migration generation:

- inspect the generated SQL;
- verify it matches the approved plan;
- reject unexpected destructive statements unless explicitly approved;
- update seed data only when required;
- update contracts/API/frontend consumers when fields cross boundaries.

## Validation

Minimum validation for Prisma schema or migration work:

```bash
pnpm --filter api prisma:generate
pnpm lint:api
pnpm typecheck:api
pnpm test:api
```

If contracts or frontend-visible fields changed:

```bash
pnpm typecheck
pnpm test:ci
pnpm build:ci
```

For real migration changes, also validate against a local or disposable database:

```bash
pnpm --filter api prisma:migrate:dev --name <migration-name>
```

or, for applying committed migrations to an empty disposable database:

```bash
pnpm --filter api prisma:migrate:deploy
```

Record:

- database type and whether it was disposable;
- commands run;
- generated migration directory;
- any destructive SQL found;
- validation not run and remaining risk.
