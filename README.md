# Swiss Kit Core

> A reusable full-stack TypeScript baseline for building web applications
> with authentication, access control, shared contracts, testing and deployment.

Swiss Kit Core is a production-oriented monorepo built with **React/Vite,
NestJS, Prisma/PostgreSQL and Zod**.

The project focuses on infrastructure and engineering concerns that commonly
need to be rebuilt across web products, such as authentication, authorization,
shared API contracts, automated validation, health checks and deployment
structure.

It is designed as a reusable baseline rather than as a single-purpose
application.

---

## Highlights

- React + Vite frontend
- NestJS API
- PostgreSQL with Prisma
- Shared Zod contracts between frontend and backend
- Google OAuth authentication
- HttpOnly JWT cookie sessions
- User provisioning and activation
- Local access control
- Health and readiness checks
- Unit and integration validation
- Browser E2E tests
- CI with GitHub Actions
- Railway deployment documentation

---

## Architecture

Swiss Kit Core is organized as a TypeScript monorepo.

```text
.
├── apps/
│   ├── web/          React + Vite frontend
│   └── api/          NestJS + Prisma backend
│
├── packages/
│   └── contracts/    Shared Zod schemas and API-facing types
│
└── docs/
    └── current/      Current runtime source of truth
```

The shared contracts package defines the API-facing boundary between the web
application and backend.

This reduces duplication of request/response shapes and keeps validation and
types aligned across both sides of the application.

---

## Current baseline

The repository explicitly separates implemented behavior from partial,
reference and out-of-scope capabilities.

### Core / implemented

- Google OAuth authentication
- HttpOnly JWT cookie session
- user provisioning
- user activation state
- local access control
- health checks
- authenticated web shell
- shared frontend/backend contracts

### Core / partial

- settings currently provides a protected overview;
- persistence and editing for settings are not implemented yet.

### Reference / implemented

- the `tasks` capability demonstrates the complete
  web → API → contracts module path;
- it currently uses static reference data.

### Optional / not implemented

- files
- notifications

### Out of scope

- multi-tenancy

The complete implementation state is documented in the
[`docs/current`](./docs/current/README.md) directory.

---

## Authentication

Authentication is based on Google OAuth.

The backend handles the authentication flow and creates a session represented
by an HttpOnly cookie.

The application also includes user provisioning and an activation state used
to control access to protected areas.

Production configuration requires the frontend and API domains, OAuth callback
URL, CORS configuration and cookie attributes to remain aligned.

---

## Access control

The current baseline includes local access control for protected application
capabilities.

Authorization behavior and ownership rules are documented in:

- [`docs/access-control.md`](./docs/access-control.md)
- backend boundary documentation
- frontend boundary documentation

Access control is intentionally kept distinct from authentication.

Authentication answers who the user is, while access control determines what
the authenticated user is allowed to access.

---

## Shared contracts

Public shapes exchanged between the API and frontend are defined in the
shared contracts package.

```text
packages/contracts
```

The package uses **Zod** schemas to provide runtime validation and TypeScript
types for API-facing data.

This makes the contract between frontend and backend explicit instead of
duplicating interfaces independently in both applications.

---

## Validation strategy

The project provides two main validation gates.

### Fast validation

```bash
pnpm check
```

This is the Docker-free validation gate.

It includes checks such as:

- linting;
- type checking;
- Prisma generation;
- script tests;
- frontend tests;
- backend unit tests.

### Complete verification

```bash
pnpm verify
```

This is the stronger isolated verification gate.

It includes:

- isolated PostgreSQL setup;
- backend integration tests;
- frontend E2E tests;
- production build validation.

The complete command behavior and prerequisites are documented in:

[`docs/reference/scripts.md`](./docs/reference/scripts.md)

---

## Continuous Integration

GitHub Actions runs the repository validation workflow in CI.

The CI pipeline uses the same project-level validation commands used locally,
which helps reduce differences between local development and automated
verification.

Before opening a pull request, contributors are expected to run the
appropriate validation gate for the type of change being made.

See:

[`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

## Health checks

The API exposes runtime health endpoints.

### Liveness

```text
GET /api/health/live
```

Used to indicate that the application process is running.

### Readiness

```text
GET /api/health/ready
```

Used to verify that required dependencies, including PostgreSQL, are available
for the application to serve requests correctly.

---

## Deployment

The project includes deployment documentation for **Railway**.

The intended topology uses separate services for the frontend and backend:

```text
Browser
   |
   v
React / Vite Web
   |
   v
NestJS API
   |
   v
PostgreSQL
```

The repository documents:

- frontend and API build/start commands;
- environment-variable setup;
- Prisma migrations;
- database seed;
- health-check validation;
- Google OAuth callback configuration;
- CORS configuration;
- cookie configuration for production.

The deploy configuration is currently operational at the provider level rather
than represented as infrastructure-as-code in this repository.

See:

[`docs/deployment.md`](./docs/deployment.md)

---

## Production-sensitive configuration

Some configuration errors can break authentication or application readiness
even when the services themselves are running.

Important examples include:

- incorrect Google OAuth callback URLs;
- invalid CORS origins;
- incompatible cookie `SameSite` / `Secure` settings;
- missing or invalid `DATABASE_URL`;
- incorrect frontend-to-API configuration.

These cases are documented so deployment behavior is treated as part of the
system rather than as an external afterthought.

---

## Local development

Start with the local setup guide:

[`docs/guides/local-setup.md`](./docs/guides/local-setup.md)

The repository pins its expected runtime and package-manager versions.

Use the project command reference for the authoritative list of setup,
database, development and validation commands:

[`docs/reference/scripts.md`](./docs/reference/scripts.md)

---

## Typical workflow

A normal development workflow is:

```bash
# install / prepare the project
pnpm bootstrap

# start development dependencies
# see the local setup documentation

# run the application
pnpm dev

# run the regular validation gate
pnpm check

# run the complete verification gate when required
pnpm verify
```

Use the command reference rather than this section when exact behavior or
prerequisites matter.

---

## Repository philosophy

Swiss Kit Core is intentionally explicit about what is implemented and what is
not.

The repository uses documentation such as capability matrices, architecture
notes and validation commands to avoid presenting planned or reference
behavior as completed functionality.

The goal is to make the baseline easier to understand, extend and validate
before using it as the foundation for another application.

---

## Documentation

### Current implementation

- [Current implementation](./docs/current/README.md)
- [Capability matrix](./docs/current/capability-matrix.md)
- [Release readiness](./docs/current/release-readiness.md)

### Architecture

- [Architecture](./docs/architecture.md)
- [Core scope](./docs/core-scope.md)
- [Access control](./docs/access-control.md)

### Development

- [Local setup](./docs/guides/local-setup.md)
- [Command reference](./docs/reference/scripts.md)
- [Environment](./docs/env.md)
- [Contributing](./CONTRIBUTING.md)

### Operations

- [Deployment](./docs/deployment.md)

### Reuse

- [Template usage](./docs/template-usage.md)

---

## Tech stack

### Frontend

- TypeScript
- React
- Vite
- Zod

### Backend

- TypeScript
- Node.js
- NestJS
- Prisma
- Zod

### Data

- PostgreSQL

### Engineering

- automated tests
- integration tests
- browser E2E tests
- GitHub Actions
- Docker-based isolated validation

### Deployment

- Railway

---

## Project status

Swiss Kit Core is actively evolving.

The current implementation state is documented rather than inferred from the
roadmap or planned features.

For the most accurate view of what exists today, start with:

[`docs/current/capability-matrix.md`](./docs/current/capability-matrix.md)

---

## Author

**Pedro Augusto Portilho Ronzani**

Software Developer focused on backend and full-stack engineering.

- GitHub: [@PedroRonzani18](https://github.com/PedroRonzani18)
- LinkedIn: [Pedro Augusto Portilho Ronzani](https://www.linkedin.com/in/pedro-augusto-portilho-ronzani/)
