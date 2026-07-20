# Environment

This documents variables validated or consumed by the current runtime, plus the one seed-only bootstrap variable. Use the app `.env.example` files as the starting shape; never commit real values.

## Web

| Variable | Required | Meaning |
| --- | --- | --- |
| `VITE_API_URL` | No | API base URL. Defaults to `/api`; Vite proxies that path to local API development. |

## API

| Variable | Required | Meaning |
| --- | --- | --- |
| `DATABASE_URL` | Runtime optional; required for database-backed features and seed | PostgreSQL connection string. |
| `INITIAL_ADMIN_EMAIL` | No; seed only | When present for an email with no user record, seed creates an active administrator with the persistent `admin` role; API runtime does not validate or read it. |
| `JWT_SECRET` | Yes | JWT signing secret. |
| `JWT_EXPIRES_IN` | No | JWT duration; defaults to `1d`. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Yes | Google OAuth configuration. |
| `WEB_APP_URL` | No | Trusted web URL; defaults to `http://localhost:8080`. |
| `CORS_ALLOWED_ORIGINS` | No | Comma-separated browser origins; defaults to `WEB_APP_URL`. |
| `AUTH_COOKIE_NAME` | No | Cookie name; defaults to `swisskit_auth`. |
| `AUTH_COOKIE_SAME_SITE` | No | `lax`, `none`, or `strict`; defaults to `lax`. |
| `AUTH_COOKIE_SECURE` | No | Secure-cookie flag. Defaults to true in production or when SameSite is `none`. |
| `AUTH_COOKIE_DOMAIN` | No | Optional cookie domain. |
| `NODE_ENV`, `PORT` | No | Environment (`development` default) and HTTP port (`3001` default). |

`AUTH_COOKIE_SAME_SITE=none` requires secure cookies. `GOOGLE_CALLBACK_URL` must exactly match Google Cloud configuration.

## Seed administrator

Set `INITIAL_ADMIN_EMAIL` only when the seed should provision an administrator. When that email has no existing user record, seed creates an active user without a Google identity and assigns `admin`. On the first Google login with that email, runtime binds the Google identity while retaining the assignment.

When the variable is absent, or either record already exists, seed skips administrator provisioning. It never reactivates or promotes existing access. Runtime login assigns `member` only to users with no role assignments.
