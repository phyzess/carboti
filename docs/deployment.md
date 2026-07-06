# Cloudflare Deployment Preparation

Status: draft
Date: 2026-06-27

This runbook prepares a real Cloudflare account for `qitu`. It keeps resource creation and remote migration explicit because account IDs, resource IDs, verified senders, and final hostnames are environment-specific.

## 1. Static Demo

The frontend-only demo deploys to a dedicated Cloudflare Pages project and does not require Worker
bindings, D1, R2, Queue, Email, or secrets:

```sh
vp run build:demo
vp exec wrangler pages project create qitu-demo --production-branch main
vp run deploy:demo
```

The demo build sets `VITE_QITU_API_MODE=mock`, serves `apps/web/dist`, and stores fixture state in
browser `localStorage`. Use it for visual review and walkthroughs only. Do not use it as a release
gate for Worker-backed behavior.

Recommended Pages shape:

| Field         | Value               |
| ------------- | ------------------- |
| Project name  | `qitu-demo`         |
| Build command | `vp run build:demo` |
| Build output  | `apps/web/dist`     |
| Bindings      | none                |

See `docs/demo.md` for the full boundary and reset instructions.

## 2. Dry Run

Run a Worker bundle dry-run before touching remote resources:

```sh
vp run deploy:dry-run
```

The dry-run output is written under `.tmp/worker-dry-run`, which is ignored by git.

Preview and production dry-runs build the web app first, then verify the Worker + Static Assets bundle:

```sh
vp run deploy:preview:dry-run
vp run deploy:production:dry-run
```

Preview and production dry-runs also run `scripts/deploy-preflight.mjs`, then confirm Cloudflare
authentication with `wrangler whoami` before asking Wrangler to bundle the remote target. The
preflight prints a non-secret configuration summary and fails before bundling when:

1. `PUBLIC_APP_URL` is missing, not HTTPS, still points at `example.com`, points at localhost, or uses a `workers.dev` diagnostic URL.
2. `EMAIL_DELIVERY_MODE` is not `send`.
3. `MAIL_FROM` is missing or still uses `example.com`.
4. The target D1 database id is still a placeholder.
5. The Worker is missing the `send_email` binding, static assets handoff, or import queue DLQ.

`apps/worker/wrangler.jsonc` serves the built React app as same-origin Worker Static Assets for preview and production. API routes still run through the Worker first for `/api/*` and `/health`, so the web app can keep relative API URLs and HttpOnly cookies without adding CORS.

Run a target health check after any deployed Worker is reachable:

```sh
QITU_PREVIEW_APP_URL=https://preview.example.com vp run health:preview
QITU_PRODUCTION_APP_URL=https://app.example.com vp run health:production
```

The health check requests `/health`, verifies the `carboti-worker` response contract, and confirms the reported runtime environment is `preview` or `production`. It does not read or print secrets.

Use `QITU_PREVIEW_WORKER_URL` or `QITU_PRODUCTION_WORKER_URL` only for optional internal Worker
diagnostics during the release gate. Do not set `PUBLIC_APP_URL` to a workers.dev URL; invitation and
password-reset links must use the public custom origin.

## 3. Required Resources

The Worker expects:

| Binding        | Product | Local name                 | Preview name                   | Production name                   |
| -------------- | ------- | -------------------------- | ------------------------------ | --------------------------------- |
| `DB`           | D1      | `carboti-dev`                 | `carboti-preview`                 | `carboti-production`                 |
| `SOURCE_FILES` | R2      | `carboti-source-files-dev`    | `carboti-source-files-preview`    | `carboti-source-files-production`    |
| `IMPORT_JOBS`  | Queues  | `carboti-import-jobs-dev`     | `carboti-import-jobs-preview`     | `carboti-import-jobs-production`     |
| DLQ            | Queues  | `carboti-import-jobs-dev-dlq` | `carboti-import-jobs-preview-dlq` | `carboti-import-jobs-production-dlq` |
| `EMAIL`        | Email   | local metadata only        | Cloudflare Email Sending       | Cloudflare Email Sending          |
| Email Routing  | Email   | local simulated handler    | route to Worker email handler  | route to Worker email handler     |

Create remote resources with account-specific names:

```sh
wrangler d1 create carboti-preview
wrangler r2 bucket create carboti-source-files-preview
wrangler queues create carboti-import-jobs-preview
wrangler queues create carboti-import-jobs-preview-dlq
wrangler d1 create carboti-production
wrangler r2 bucket create carboti-source-files-production
wrangler queues create carboti-import-jobs-production
wrangler queues create carboti-import-jobs-production-dlq
```

Then replace `REPLACE_WITH_PREVIEW_D1_DATABASE_ID` and `REPLACE_WITH_PRODUCTION_D1_DATABASE_ID` in `apps/worker/wrangler.jsonc` before remote migration or deployment.

Cloudflare Email Service must be configured with a verified sender before invitation or password reset email can be sent outside local mode. Set `EMAIL_DELIVERY_MODE=send`, set `MAIL_FROM` to a verified address for the target environment, optionally set `MAIL_REPLY_TO`, and keep `PUBLIC_APP_URL` aligned with the deployed web origin.

Inbound email requires Cloudflare Email Routing to route one or more intake addresses to this Worker.
The Worker `email` handler stores raw messages under the `raw-emails/` R2 prefix and sends supported
attachments through the same `source_files -> import_jobs -> queue` path as manual upload. Unsupported
attachments are recorded in `inbound_email_attachments` without adding business parsing logic to
reusable packages.

## 4. Secrets

The current kit baseline uses deterministic local AI advisory generation and does not require model-provider secrets. Future provider adapters should set secrets through Wrangler or the Cloudflare dashboard:

```sh
wrangler secret put PROVIDER_API_KEY --env preview
wrangler secret put PROVIDER_API_KEY --env production
```

Do not commit secret values into `.env`, `apps/worker/.dev.vars`, docs, or
`apps/worker/wrangler.jsonc`.

`EMAIL_DELIVERY_MODE`, `MAIL_FROM`, `MAIL_REPLY_TO`, `PUBLIC_APP_NAME`, and `PUBLIC_APP_URL` are configuration values, not secrets. They still need environment-specific review before deployment.

## 5. Remote Migration

After resource IDs are set:

```sh
vp run db:migrate:preview
vp run db:migrate:production
```

Remote migration should be explicit and reviewed. Do not hide it behind the default local setup command.

After each remote migration, inspect the migration list and at least one expected table:

```sh
wrangler d1 migrations list carboti-preview --env preview --remote
wrangler d1 execute carboti-preview --env preview --remote --command "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;"
```

## 6. Deployment Gate

Before a real deployment:

1. Run `vp run verify:kit`.
2. Run `vp run deploy:dry-run`.
3. Run the target env dry-run: `vp run deploy:preview:dry-run` or `vp run deploy:production:dry-run`.
4. Confirm remote resource IDs are not placeholders.
5. Confirm `PUBLIC_APP_URL` matches the deployed web origin.
6. Confirm provider secrets exist if optional real AI providers are enabled.
7. Confirm `EMAIL_DELIVERY_MODE=send` and `MAIL_FROM` uses a verified Cloudflare Email sender.
8. Confirm invitation bootstrap routes and the login-page setup UI are disabled outside `APP_ENV=local`.
9. Confirm the target queue has a dead-letter queue.
10. Run the failed-job snapshot for the target environment.
11. Confirm `wrangler whoami` reports the expected Cloudflare account before deployment.
12. Run the target deploy command, which rebuilds, deploys, prints the Worker version id, and health-checks the deployed URL.
13. Optionally set `QITU_PREVIEW_WORKER_URL` or `QITU_PRODUCTION_WORKER_URL` to run a second internal Worker health check after the public custom-origin health check.

The release gate script codifies the reviewed sequence above. By default it prints the plan only:

```sh
vp run release:preview
vp run release:production
```

Execute the full gate only after the target app URL, remote resource IDs, migrations, email sender, queue DLQ, and operator approval have been reviewed:

```sh
QITU_PREVIEW_APP_URL=https://preview.example.com \
  vp run release:preview -- --yes

QITU_PRODUCTION_APP_URL=https://app.example.com \
  vp run release:production -- --yes
```

The full gate runs `verify:kit`, target deploy dry-run with preflight, target remote D1 migration,
failed-job snapshot, deploy, public health check, and an optional internal Worker health check. The
remote dry-run and deploy wrappers run `wrangler whoami`; the deploy wrapper fails if Wrangler
does not report a Worker version id after upload. Use `--failed-job-limit 100` if the operator
snapshot needs a larger review window.

```sh
vp run ops:failed-jobs -- preview --limit 50
vp run ops:failed-jobs -- production --limit 50
```

Use the explicit target deploy command only after the gate above is green:

```sh
QITU_PREVIEW_APP_URL=https://preview.example.com vp run deploy:preview
QITU_PRODUCTION_APP_URL=https://app.example.com vp run deploy:production
```

The deploy scripts do not apply remote D1 migrations automatically. Run `vp run db:migrate:preview` or `vp run db:migrate:production` as a reviewed step before deploying code that depends on a schema change.

Local smoke/demo cleanup is intentionally local-only:

```sh
vp run ops:cleanup-local-smoke -- --dry-run
vp run ops:cleanup-local-smoke
```

Do not adapt this command for preview or production cleanup. Remote recovery should go through reviewed app/API actions and the DLQ runbook.

## 7. First Admin Runbook

Preview and production must use invitation-only onboarding. Do not enable local bootstrap routes, do not expose the `Setup` tab, and do not publish demo credentials outside local development.

For a new environment:

1. Apply the remote D1 migrations.
2. Create a one-time admin invitation with the operator command for the target environment.
3. Send the generated invitation URL to the first operator through an approved private channel.
4. Have the operator accept the invitation, set a password, and create any additional admins through `/settings/members`.
5. Revoke unused invitations after the first operator account is active.

```sh
QITU_PREVIEW_APP_URL=https://preview.example.com \
  vp run ops:create-admin-invite -- preview --email first-admin@example.com

QITU_PRODUCTION_APP_URL=https://app.example.com \
  vp run ops:create-admin-invite -- production --email first-admin@example.com
```

Use `--dry-run` first when validating the target and app URL. The successful command prints a one-time invitation URL; treat that URL as a secret operational artifact and do not paste it into issue trackers, docs, logs, or chat rooms that are not approved for secrets.

The operator command rejects non-local `PUBLIC_APP_URL` values that are not HTTPS, still use
`example.com`, point at localhost, or use a workers.dev diagnostic URL.

If all admin access is lost, repeat the same one-time admin invitation process instead of re-enabling local bootstrap in a deployed environment. The operator command still creates an invitation, not a user/password directly, so the first recovered admin accepts the invite through the normal password setup, session, and audit path.

## 8. DLQ And Failed Job Recovery

Use `docs/operations/dlq-remediation.md` when Queue messages reach a dead-letter queue or import jobs appear stuck. The baseline recovery path is deliberately manual:

1. Inspect failed or suspicious jobs with `vp run ops:failed-jobs`.
2. Restore missing R2 source objects or deploy missing adapters before retrying.
3. Retry through the app/API so RBAC, audit, idempotency, and Queue dispatch stay intact.
4. Escalate repeated failures instead of blind replaying DLQ messages.

The starter does not attach an automatic DLQ consumer. Add one only after a real production queue proves that manual recovery is insufficient.

## 9. Known Gaps

Before production use, add:

1. Runtime integration tests for Cloudflare platform behavior that cannot be covered by local fakes.
2. A deployment automation or infrastructure-as-code path.

For sender reputation and inbox placement, see `docs/operations/email-deliverability.md`.
