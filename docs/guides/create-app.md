# Create an App

This guide describes the current manual flow and future CLI direction for creating an application from `qitu`.

The repository is a runnable kit baseline. Until a dedicated CLI exists, `templates/app/manifest.json` is the authoritative copy manifest for a new app repository.

## Inputs

Before creating an app, decide:

1. App name.
2. First business feature name.
3. Deployment environment names.
4. Auth policy.
5. File retention policy.
6. Whether inbound email is enabled.
7. Whether AI advisory features are enabled.

## Adoption Script

After copying the manifest paths into a new repository, use the adoption script to plan the
rename from `qitu` to the app-owned identity:

```text
vp run adopt:app -- --name internal-tool
```

The script is dry-run by default. It reports package namespace, session cookie, Worker name,
Cloudflare resource-name, and public app-name edits without writing files. After reviewing the
plan, apply the identity rename:

```text
vp run adopt:app -- --name internal-tool --apply
```

For a real product repository that no longer wants scaffold navigation noise, remove starter-only
templates, examples, agent docs, and kit-completion documents after the first copied baseline has
been verified:

```text
vp run adopt:app -- --name internal-tool --clean-product-baseline --apply
```

The script prints remote safety steps instead of changing remotes automatically:

```text
git remote rename origin qitu-template
git remote set-url --push qitu-template DISABLED
git remote add origin <app-owned-git-url>
```

This keeps the upstream scaffold visible while preventing accidental pushes back to the template.

## Future CLI

The eventual CLI should feel like this:

```text
qitu create app <app-name>
```

Expected output:

```text
apps/web
apps/worker
packages/*
templates/*
examples/import-review
examples/json-records
```

The generated app may organize business code inside `apps/*/src/features/*`, inside app-local route folders, or in a future portable feature/module layout. `qitu` should not force a top-level business folder before a real app proves the need.

## Manual Flow Before CLI Exists

1. Read `templates/app/manifest.json`.
2. Copy every path listed in `manifest.json.copy`.
3. Keep or remove `manifest.json.optionalExamples`.
4. Run `vp run adopt:app -- --name <app-name>` and review the dry-run plan.
5. Run `vp run adopt:app -- --name <app-name> --apply`.
6. Rename the upstream remote to `qitu-template` and disable its push URL.
7. Run `vp run setup`.
8. Run `vp run verify:kit`.
9. Add the first app-owned feature from `templates/feature`.
10. Add app-owned migrations and routes only after the first feature needs them.
11. Optionally run `vp run adopt:app -- --name <app-name> --clean-product-baseline --apply` after the copied baseline is verified.

## Cloudflare Bindings

Minimum expected bindings:

```text
D1 database
R2 bucket
Queue
Email Sending
Email Routing, if inbound email is enabled
AI binding, if advisory features are enabled
```

The default local Worker keeps AI advisory generation deterministic, so a real AI binding is not required for the first local vertical slice.

## App-Managed Auth

The default app should own its users.

Expected flows:

1. Admin creates an invitation.
2. System emails the invite link.
3. Invitee accepts the link.
4. Invitee sets a password.
5. User logs in with email and password.
6. User can reset password by email.

Do not depend on Cloudflare Access for product users.

## Validation Checklist

Before calling an app usable:

1. `README.md` explains how to run it.
2. Local development has one primary command.
3. Migrations can run locally and remotely.
4. Secrets are documented but not committed.
5. The first protected route works.
6. Audit events are written for sensitive actions.
7. Business-owned feature code does not leak into reusable `packages/*`.
8. `templates/app/manifest.json` paths were copied or intentionally excluded.
9. `carboti_session`, `carboti-worker`, `carboti-dev`, `carboti-preview`, and `carboti-production` no longer appear in runtime config unless the app intentionally keeps qitu names.
10. The upstream scaffold remote cannot receive pushes from the product repository.
