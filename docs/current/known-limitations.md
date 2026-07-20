# Known limitations

Prioritized from the current runtime. These are not commitments or a roadmap.

## Critical

| Problem | Impact and affected area | Recommendation | Blocks template use? | Suggested follow-up |
| --- | --- | --- | --- | --- |
| No known issue currently blocks local use when Google OAuth, database, and seed configuration are correct. | — | Keep validation and documentation aligned with the runtime. | No | — |

## Important

| Problem | Impact and affected area | Recommendation | Blocks template use? | Suggested follow-up |
| --- | --- | --- | --- | --- |
| Administrator provisioning is seed-driven: `INITIAL_ADMIN_EMAIL` creates access only for a new email and never restores existing access. | Authentication, seed, and access-control onboarding require careful environment use. | Define the variable only when provisioning the intended administrator; manage existing access changes explicitly. | No | Administrator management policy |
| Access-control administration is read-only. | Persisted roles, direct grants, and assignments are enforced but cannot be managed in the app. | Add management APIs/UI only under a separate authorization scope. | No | Access-control administration |
| User provisioning needs an existing privileged user. | There is no separate invitation or recovery workflow after bootstrap. | Decide whether a reusable recovery or invitation pattern belongs in Core or an optional module. | No | Access onboarding/recovery |

## Improvement

| Problem | Impact and affected area | Recommendation | Blocks template use? | Suggested follow-up |
| --- | --- | --- | --- | --- |
| Settings is a static shell. | The protected settings API/page has no persistence or editing. | Keep it documented as partial; add only a generic, separately specified settings capability. | No | Settings persistence policy |
| Tasks is reference-only. | The full-stack example uses static data and has no workflow. | Preserve it as a module-authoring reference; create product tasks elsewhere. | No | None for Core |

## Optional

| Problem | Impact and affected area | Recommendation | Blocks template use? | Suggested follow-up |
| --- | --- | --- | --- | --- |
| There is no tenancy or optional integration. | No tenant isolation, files storage, notification delivery, Redis session store, queues, or email service exists. | Keep multi-tenancy out of scope; introduce optional capabilities only through explicit designs. | No | Optional capability proposals |

Before addressing any item, decide whether it remains Core, becomes an optional preset, or belongs to a product module.
