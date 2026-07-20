# Capability matrix

Status labels describe both template scope and runtime state. `Implemented` means code is registered and reachable; it does not imply a complete enterprise feature.

| Capability | Classification | Runtime status | Evidence |
| --- | --- | --- | --- |
| Authentication and session | Core | Implemented | Google OAuth, JWT cookie, `/api/auth/me`, global JWT guard |
| Seed administrator provisioning | Core | Implemented | Optional `INITIAL_ADMIN_EMAIL`; for a new email, seed creates an active unbound user and persistent `admin` assignment; runtime does not read it |
| Users | Core | Implemented | `/api/users` and `/users` expose persisted profiles read-only |
| User provisioning and activation | Core | Implemented | `/api/users` supports list, create/reactivate, and status update; `/users` is the UI |
| Local access control | Core | Implemented | Persisted permission groups, permissions, roles, direct grants, role grants, API guard and shell filtering |
| Settings | Core | Partial | `/api/settings` and `/settings` provide a protected static overview; no persisted settings or editing |
| Health and API docs | Core | Implemented | liveness/readiness endpoints and Swagger at `/api/docs` |
| Tasks | Reference | Implemented | Full web/API/contracts path with static task data; use as module-authoring reference, not product work |
| Files | Optional | Not implemented | No storage provider, schema, endpoint, or UI |
| Notifications | Optional | Not implemented | No delivery provider, schema, endpoint, or UI |
| Multi-tenancy | Out of scope | Not implemented | No tenant model, isolation, tenant-aware authorization, or tenant routing |

The browser uses permissions only to improve navigation and route UX. API guards are the authorization boundary.

## Active modules

The API registers `auth`, `core`, `health`, `settings`, `users`, `access-control`, and `tasks`. The web registry exposes `core`, `settings`, `users`, `access-control`, and `tasks`.
