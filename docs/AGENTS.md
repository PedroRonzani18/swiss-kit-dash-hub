# Docs AGENTS.md

## Scope

These instructions apply to `docs`.

Read this file before changing architecture docs, setup docs, module authoring docs, Codex workflow docs or any documentation that guides future implementation.

Also read:

- root `AGENTS.md`
- the scoped `AGENTS.md` for any app/package discussed by the doc
- current source files when documenting implementation details

## Documentation principles

Docs should help a future Codex run make fewer guesses.

Good docs are:

- accurate to the current repository state;
- explicit about what is Core vs future work;
- clear about boundaries and validation commands;
- short enough to be read during planning;
- specific about file paths and ownership;
- honest about out-of-scope items.

Do not document aspirational behavior as if it already exists.

## Template documentation

When changing template direction, update the relevant doc:

- `docs/template.md`: what Swiss Kit Core is and is not.
- `docs/module-authoring.md`: how modules should be created.
- `docs/codex-workflow.md`: how Codex agents should plan, implement, review and test.
- `docs/architecture.md`: current architecture and runtime behavior.

If a doc describes frontend behavior, check `apps/web/docs/frontend-boundaries.md`.

If a doc describes backend behavior, check `apps/api/docs/backend-boundaries.md`.

If a doc describes contracts, check `packages/contracts/AGENTS.md` and current contract exports.

## Style

Prefer:

- concrete paths;
- short sections;
- checklists for repeatable work;
- examples that use generic module names;
- explicit out-of-scope notes.

Avoid:

- client-specific examples;
- stale TODOs without owner or purpose;
- undocumented assumptions;
- vague terms such as "just", "simple" or "obvious" when describing architecture.

## Validation

For docs-only changes:

- read through changed docs for consistency;
- verify referenced paths exist or are clearly marked as planned/future;
- do not claim runtime validation unless commands actually ran.

For docs that accompany code changes, use the validation instructions from the relevant app/package `AGENTS.md`.
