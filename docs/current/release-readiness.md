# v0.1.0 release readiness

## Release state

`v0.1.0` is **prepared only**. No Git tag, package publication, release
deployment, or production sign-off has been performed by this repository
state. The supported runtime scope is the [capability matrix](./capability-matrix.md);
known operational gaps are in [known limitations](./known-limitations.md).

## Version and compatibility policy

Swiss Kit Core uses SemVer with a pre-1.0 compatibility rule:

- A backward-incompatible change to the supported public surface increments
  the minor version while the major version is `0` (`0.1.0` → `0.2.0`).
- Patch versions contain backward-compatible fixes and documentation-only
  corrections.
- The public surface includes documented setup/deployment behavior, shared API
  contracts, and supported web/API integration paths. Internal refactoring
  that does not alter that surface may remain within a patch release.

## Validation matrix

| Gate | Status | Evidence or next action |
| --- | --- | --- |
| Runtime scope classified | Complete | Capability matrix classifies Core, Reference, Optional, and Out of scope behavior. |
| Known limitations recorded | Complete | Known limitations document seed-admin, access-control administration, settings, reference tasks, and optional-integration constraints. |
| Release notes prepared | Complete | Root [`CHANGELOG.md`](../../CHANGELOG.md) records the prepared `0.1.0` baseline and compatibility policy. |
| Automated repository validation | Complete | `pnpm check` and `pnpm verify` passed against the release candidate. The latter ran unit/integration/E2E tests and isolated Docker-backed verification. |
| Production build validation | Complete | `pnpm verify` completed `pnpm build:ci` successfully. |
| Manual Google OAuth flow | Pending | In the final deployed-domain configuration, test Google sign-in, callback allowlist, cookie delivery, `/api/auth/me`, logout, and protected-route access. |
| Manual readiness and API docs | Pending | After deployment, verify `/api/health/live`, `/api/health/ready`, and `/api/docs` against the configured API domain. |
| Derived-project instantiation | Complete with manual OAuth pending | A disposable copy was renamed (`release-proof-kit` / `ReleaseProof`), received a new full-stack `release-proof` module through the scaffold, and passed `pnpm check`. The original scaffold command documented with an extra `--` was corrected after this exercise exposed the incompatibility. |

## Risk classification

| Risk | Classification | Release handling |
| --- | --- | --- |
| OAuth callback, CORS, and cookie configuration | High | Requires the pending manual deployed-domain OAuth test; configuration drift can block authentication. |
| Database migration, seed, and administrator provisioning | High | Verify the target `DATABASE_URL`, apply migrations (including `User.sessionVersion`), and seed deliberately. `INITIAL_ADMIN_EMAIL` only provisions a new email and does not restore existing access. |
| Shared contracts and access control | High | Treat compatibility changes as minor-version work during `0.x`; API guards remain the authorization boundary. |
| Deployment topology and provider configuration | Medium | Deployment is operational rather than versioned as IaC; validate the configured web/API domains and health endpoints. |
| Static settings and reference tasks | Low | Deliberately scoped limitations; do not represent them as complete product features. |
| Optional capabilities and multi-tenancy | Low for this release scope | Not included in `0.1.0`; keep them out of release expectations. |

## Derived-project update policy

Derived projects consume upstream changes through a manual merge process.
There is no promise of an automated sync, conflict-free update, or generated
data migration. An update owner should:

1. Review the upstream changelog, diff, and affected documentation.
2. Classify contract, Prisma, environment, authentication, authorization, and
   deployment changes before merge.
3. Merge selected upstream changes into the derived project and adapt its
   product-specific code deliberately.
4. Run the derived project's automated validation and manual OAuth smoke test
   before deployment.

This process preserves the Core baseline without implying that every upstream
change is directly compatible with every derived project.

## Evidence limits

The disposable derived-project exercise did not use Google credentials, start
the database, apply migrations, or run `pnpm verify`. Those environment-bound
steps remain covered by the pending manual OAuth and deployment checks above;
they must not be inferred from the local scaffold proof.
