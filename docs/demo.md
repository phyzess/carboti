# Static Demo

Status: draft
Date: 2026-07-06

The `qitu` demo is a frontend-only showcase for the reusable app shell and first vertical slice.
It is meant for review, sharing, and product-shape discussion before a real Cloudflare account is
provisioned.

## Boundary

Demo is not preview.

| Environment  | Host shape                  | API/data behavior                                    | Use for                        |
| ------------ | --------------------------- | ---------------------------------------------------- | ------------------------------ |
| `demo`       | Cloudflare Pages static app | Browser-local mock API and fixtures                  | Visual review and walkthroughs |
| `preview`    | Worker Static Assets        | Real Worker with D1, R2, Queue, and Cloudflare Email | Release validation             |
| `production` | Worker Static Assets        | Real Worker with production Cloudflare resources     | Real operators                 |

The demo build sets `VITE_QITU_API_MODE=mock`. In that mode, `apps/web/src/api-client.ts` loads
`apps/web/src/mock-api.ts` instead of calling `/api/*` or `/health`. The mock API entrypoint is a
thin route composer; auth, invitation, workspace, import-job, review, advisory, source upload, model,
seed, and audit behavior lives in focused `mock-api-*-routes.ts`, `mock-api-*-operations.ts`,
`mock-api-seed-*`, and model/helper modules. Mock state is stored in browser `localStorage`; no
Worker, D1, R2, Queue, Email Sending, Email Routing, or secrets are used.

## Local Demo

Run the demo without starting the Worker:

```sh
vp run dev:demo
```

Build the static demo bundle:

```sh
vp run build:demo
```

The built output is `apps/web/dist`. `apps/web/public/_redirects` is copied into the build so
Cloudflare Pages can serve TanStack Router deep links such as `/workspace/reviews`, `/invite/*`, and
`/reset-password/*`.

The demo starts with a browser-local admin session:

```text
admin@example.com
correct horse battery staple
```

If the user logs out, the same credentials are prefilled. The mock login accepts browser-local demo
accounts only and does not contact a server.

To reset local demo state, clear site storage for the demo origin or run this in the browser console:

```js
localStorage.removeItem("qitu.demo.mockState.v1");
location.reload();
```

## Cloudflare Pages

The recommended public demo host is a dedicated Cloudflare Pages project, for example:

```text
qitu-demo
demo.qitu.dev
```

Direct upload deploy:

```sh
vp run deploy:demo
```

Create the Pages project once before the first deploy if it does not already exist:

```sh
vp exec wrangler pages project create qitu-demo --production-branch main
```

Defaults:

| Setting      | Default     | Override                  |
| ------------ | ----------- | ------------------------- |
| Project name | `qitu-demo` | `QITU_DEMO_PAGES_PROJECT` |
| Branch       | `main`      | `QITU_DEMO_PAGES_BRANCH`  |

Equivalent explicit command:

```sh
vp run deploy:demo -- --project-name qitu-demo --branch main
```

The deploy script:

1. Builds with `VITE_QITU_API_MODE=mock`.
2. Runs `wrangler whoami` to confirm Cloudflare authentication.
3. Runs `wrangler pages deploy apps/web/dist` with `--commit-dirty=true` for direct upload builds.

For Git-based Pages deployment, configure the Pages project with:

| Field          | Value               |
| -------------- | ------------------- |
| Root directory | repository root     |
| Build command  | `vp run build:demo` |
| Build output   | `apps/web/dist`     |

Do not add D1, R2, Queue, Email, or secret bindings to the demo project. If a demo ever needs
server-side behavior, add Pages Functions under an explicit mock-only boundary rather than reusing
the Worker `preview` environment.

## Included Fixtures

The browser-local mock includes:

1. Admin, operator, and viewer users.
2. Pending and failed invitation delivery records.
3. Source files with content hashes.
4. Import jobs in `needs_review`, `approved`, and `failed` states.
5. Staged records, review issues, confirmation, exclusion, and commit actions.
6. Mock AI advisory generation, confirmation, and dismissal.
7. Audit and import-job event streams.

All mutations stay in browser storage and can be reset at any time.
