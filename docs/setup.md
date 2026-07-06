# Setup

Status: draft
Date: 2026-06-27

This guide is the default bootstrap path for a fresh `qitu` checkout.

## 1. Prerequisites

Recommended local baseline:

| Tool      | Version   | Notes                                                                                           |
| --------- | --------- | ----------------------------------------------------------------------------------------------- |
| Node.js   | `24.x`    | Current development baseline. Node `22+` should run the scripts, but use Node 24 when possible. |
| Vite+ CLI | `0.2.1`   | Command surface for install, dev, build, check, and workspace task orchestration.               |
| pnpm      | `11.5.2`  | Declared in `packageManager`. Vite+ may bootstrap it during `vp install`.                       |
| Wrangler  | `4.103.0` | Cloudflare Workers, D1, R2, Queue, and type generation.                                         |

Versions are pinned in `package.json` and `docs/architecture/dependencies.md`.

## 2. Registry Policy

The project intentionally does not set a package registry in `.npmrc`.

```ini
save-exact=true
```

This keeps the starter portable. Corporate laptops may set a registry through user-level npm config, environment variables, proxy software, or network policy. That should not be committed into the reusable template.

If `vp install` cannot reach `registry.npmjs.org`, see `docs/troubleshooting.md`.

## 3. Canonical Local Setup

```sh
vp run setup
```

This command:

1. Runs `vp install`.
2. Creates `.env` from `.env.example` if missing.
3. Creates `apps/worker/.dev.vars` from `apps/worker/.dev.vars.example` if missing.
4. Generates Worker types.
5. Applies local D1 migrations.
6. Runs `doctor`.
7. Runs `smoke`.

If dependencies are already installed, rerun the post-install setup only:

```sh
vp run setup:local
```

`doctor` checks the local toolchain and template invariants. `smoke` is a no-dependency static validation that should work even before the full test runner is available.

## 4. Local Environment

The setup command creates local env files if missing:

```sh
cp .env.example .env
cp apps/worker/.dev.vars.example apps/worker/.dev.vars
```

Do not put production secrets in these files. Use Cloudflare secrets for deployed environments.

## 5. Cloudflare Local Resources

The Worker expects these bindings:

| Binding        | Type  | Local name              |
| -------------- | ----- | ----------------------- |
| `DB`           | D1    | `carboti-dev`              |
| `SOURCE_FILES` | R2    | `carboti-source-files-dev` |
| `IMPORT_JOBS`  | Queue | `carboti-import-jobs-dev`  |
| `EMAIL`        | Email | local metadata only     |

The local env also defines:

| Variable              | Default                 | Notes                                                             |
| --------------------- | ----------------------- | ----------------------------------------------------------------- |
| `EMAIL_DELIVERY_MODE` | `store`                 | Use `store` locally and `send` after Email Service is configured. |
| `PUBLIC_APP_NAME`     | `carboti`               | Used in auth emails.                                              |
| `PUBLIC_APP_URL`      | `http://localhost:5173` | Used to build invite/reset links.                                 |
| `MAIL_FROM`           | `noreply@example.com`   | Replace with a verified sender domain.                            |
| `MAIL_REPLY_TO`       | empty                   | Optional reply-to address for auth email.                         |

For local port conflicts, the dev wrappers also honor:

| Variable                   | Default                  | Notes                                                 |
| -------------------------- | ------------------------ | ----------------------------------------------------- |
| `QITU_WEB_PORT`            | dynamic open port        | Vite web dev port.                                    |
| `QITU_WORKER_PORT`         | dynamic open port        | Wrangler Worker dev port.                             |
| `QITU_WORKER_ORIGIN`       | derived from Worker port | Vite proxy target for `/api` and `/health`.           |
| `QITU_PUBLIC_APP_URL`      | derived from web port    | Local Worker app URL override for invite/reset links. |
| `VITE_QITU_DEFAULT_LOCALE` | `en`                     | App-owned default language for new browser sessions.  |

Generate Worker types:

```sh
vp run cf:typegen
```

Apply local D1 migrations:

```sh
vp run db:migrate:local
```

Remote migrations should be explicit:

```sh
vp run db:migrate:preview
vp run db:migrate:production
```

## 6. Development

Start the full local stack:

```sh
vp run dev
```

This starts both the web app and Worker API on open local ports, then prints both
URLs. Use this as the default development command because the web app proxies
`/api` and `/health` to the exact Worker origin selected by the wrapper.

Set `QITU_WEB_PORT` or `QITU_WORKER_PORT` only when a fixed local port is needed.
When changing the web origin for invite/reset-link testing, set
`QITU_PUBLIC_APP_URL` to the same web origin so the Worker generates matching
local links.

Start only the web app when you are intentionally running or mocking the Worker separately:

```sh
vp run dev:web
```

Start only the Worker:

```sh
vp run dev:worker
```

The explicit combined alias is also available:

```sh
vp run dev:all
```

`dev` and `dev:all` use the same small Node wrapper that runs the web and Worker dev servers concurrently and prefixes output by process.

Start the frontend-only static demo when you want a shareable app walkthrough without a Worker,
D1, R2, Queue, Email, or secrets:

```sh
vp run dev:demo
vp run build:demo
```

The demo uses `VITE_QITU_API_MODE=mock` and browser-local fixtures. See `docs/demo.md`.

Local auth starts with reusable demo users:

```text
email: reviewer@example.com
email: admin@example.com
password: correct horse battery staple
```

On a fresh local D1 database, use the `Setup` tab to create or reset a local-only reviewer or admin account and sign in. The web app shows this tab only when `/health` reports `APP_ENV=local`; preview and production login pages must not expose local setup or demo credentials. After local setup, the same credentials work through the `Login` tab. The reviewer account exercises the review workflow, and the admin account exercises member and invitation settings. The bootstrap routes are disabled outside `APP_ENV=local`.

## 7. Validation

Fast static validation:

```sh
vp run smoke
```

Browser validation for the first vertical slice:

```sh
vp run smoke:browser
```

If this is the first time Playwright is used on the machine, install its Chromium binary once:

```sh
vp exec playwright install chromium
```

Full validation:

```sh
vp run validate
```

Kit verification:

```sh
vp run verify:kit
```

`validate` runs:

1. Static smoke checks.
2. Workspace type checks.
3. Vite+ checks.
4. Workspace builds.

Worker runtime validation:

```sh
vp run test:worker-runtime
```

This uses the official Cloudflare Vitest pool. It is intentionally small and currently verifies `/health` plus unauthenticated upload rejection inside the Workers runtime.

`verify:kit` runs `validate`, Worker runtime tests, local D1 migrations, and the browser smoke. Use it before claiming a kit milestone is complete.

If the machine cannot install dependencies because of network policy, record the install failure and keep using `smoke` and document-level checks until dependencies are available.

Deployment release gates:

```sh
vp run release:preview
vp run release:production
```

These commands print the reviewed release plan by default. Add `-- --yes` only when you intend to execute the target gate against Cloudflare:

```sh
QITU_PREVIEW_APP_URL=https://preview.example.com vp run release:preview -- --yes
QITU_PRODUCTION_APP_URL=https://app.example.com vp run release:production -- --yes
```

## 8. Operations

List failed or suspicious import jobs without changing data:

```sh
vp run ops:failed-jobs -- local
vp run ops:failed-jobs -- preview --limit 50
vp run ops:failed-jobs -- production --limit 50
```

Use `docs/operations/dlq-remediation.md` for DLQ triage and retry rules. Retry through the app/API, not direct SQL.

Clean local smoke/demo rows from local D1 after repeated browser runs:

```sh
vp run ops:cleanup-local-smoke -- --dry-run
vp run ops:cleanup-local-smoke
```

This command only targets `carboti-dev --local` rows with smoke/demo file and browser-smoke user prefixes. It does not operate on preview or production.

Create a one-time first-admin invitation through the audited operator path:

```sh
vp run ops:create-admin-invite -- local --email first-admin@example.com --dry-run
vp run ops:create-admin-invite -- local --email first-admin@example.com
```

For preview and production, pass the target origin with `QITU_PREVIEW_APP_URL` or `QITU_PRODUCTION_APP_URL`. The successful command prints a one-time invitation URL; handle it as a secret.

Check a running Worker without exposing secrets:

```sh
vp run health
QITU_PREVIEW_APP_URL=https://preview.example.com vp run health:preview
QITU_PRODUCTION_APP_URL=https://app.example.com vp run health:production
```

The preview and production commands require the deployed app origin because qitu does not guess account-specific hostnames.

## 9. First Feature

Start with `docs/guides/first-vertical-slice.md`.

Use `templates/feature` as a copyable skeleton. Keep business meaning in the app-owned feature code, not in reusable core packages.
