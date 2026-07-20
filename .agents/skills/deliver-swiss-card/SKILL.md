---
name: deliver-swiss-card
description: Deliver a Swiss Kit card or scoped feature from requirements through implementation and validation. Use when implementing, planning, resuming, or validating a card, issue, feature, or bug in this repository.
---

# Deliver Swiss Kit Card

Keep the request or issue as the requirements source and this repository as the implementation source of truth.

## Establish scope

1. Read the root `AGENTS.md` and every applicable nested instruction file.
2. Read the request, linked issue, relevant architecture documents, tests, and executable state.
3. Separate scope, exclusions, assumptions, and unknowns. Map acceptance criteria to affected files and validation evidence.
4. Flag auth, authorization, cookies, contracts, Prisma, migrations, environment, CI, or template-genericness risk before editing.

Use `spec-scout` only when discovery is broad, the request is ambiguous, or multiple applications are affected. Do not delegate genuinely trivial work.

## Implement

- For a small, clear request, implement directly after scope mapping.
- For broad work, produce a bounded plan before editing and delegate the approved write scope to `implementer` when isolation adds value.
- Never run overlapping write agents against the same files.
- Preserve unrelated user changes, existing boundaries, and Swiss Kit's template-generic baseline.
- Do not invent product-specific business rules or add dependencies without justification.

Ask for a human decision before editing only when an unresolved choice materially changes behavior, data, auth, permissions, contracts, migrations, or public API. Do not require an approval stop for otherwise clear work.

## Validate independently

Invoke `$validate-change` before claiming completion. Use `validator` for normal verification.
Also use `critical-reviewer` for authentication, authorization, cookies, contracts, Prisma migrations, environment, CI, destructive operations, or broad cross-application changes.

## Finish

Report:

- acceptance criteria covered and gaps;
- changed behavior and important files;
- commands with pass, fail, or not run;
- review findings and resolutions;
- remaining risks and required manual checks.

Do not claim completion while a required check is failing or unexecuted without a clear reason.
