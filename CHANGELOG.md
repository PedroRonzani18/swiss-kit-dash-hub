# Changelog

This file records release-facing changes for Swiss Kit Core. The checked-in
runtime is described by [docs/current](./docs/current/README.md).

The project follows SemVer with an explicit pre-1.0 rule: while the major
version is `0`, a breaking public compatibility change increments the minor
version (for example, `0.1.0` to `0.2.0`). Patch releases are compatible fixes
only. The public surface includes documented setup and deployment behavior,
shared API contracts, and the supported web/API integration paths.

## [Unreleased]

No release changes recorded.

## [0.1.0] — prepared, not released

`v0.1.0` is a prepared baseline release. This entry does not create a Git tag,
publish artifacts, or deploy an environment.

### Included baseline

- Core authentication with Google OAuth, an HttpOnly JWT cookie session,
  session invalidation on user deactivation, and `/api/auth/me`.
- Seed administrator provisioning, persisted users, user provisioning and
  activation, and local access control.
- Protected web shell, health/readiness endpoints, and Swagger API docs.
- Shared Zod API contracts across the web and API applications.
- Static protected settings overview and the static `tasks` reference module.

### Scope boundaries

- Settings remains partial: it has no persistence or editing.
- `tasks` is a reference module, not product workflow functionality.
- Files and notifications are optional and not implemented.
- Multi-tenancy is out of scope and not implemented.

### Compatibility and updates

- Derived projects should update from upstream by manually reviewing and
  merging selected upstream changes. There is no automated upstream-sync or
  generated migration path.
- Before merging upstream changes, compare environment, Prisma, contract,
  authentication, authorization, and deployment changes against the derived
  project. Run that project's validation and its manual OAuth smoke test.
- This prepared baseline includes the `User.sessionVersion` migration. Apply
  migrations before running a derived project that adopts this release.

See [release readiness](./docs/current/release-readiness.md) for the release
gate, evidence status, and remaining manual work.
