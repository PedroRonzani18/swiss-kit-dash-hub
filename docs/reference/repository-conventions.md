# Repository conventions

Use these conventions for branches, commits, and pull requests. They make card tracking and delivery scope explicit.

## Branches

Use `<type>/KAN-<number>-<short-description>` with a lowercase, hyphenated description.

Examples:

- `feat/KAN-123-add-user-preferences`
- `fix/KAN-123-handle-empty-session`
- `chore/KAN-123-refresh-tooling`
- `refactor/KAN-123-simplify-api-mapper`
- `docs/KAN-123-document-local-setup`
- `test/KAN-123-cover-auth-guard`

## Commits and pull requests

Use the card key followed by a Conventional Commit-style subject:

```text
KAN-123 feat(scope): description
```

Keep `scope` concise and generic, such as `auth`, `users`, `settings`, or `api`. Pull request titles use the same format and the PR template records the Card Jira link, validation, risk, and follow-up information.
