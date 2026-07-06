# Upgrade Notes

Status: draft
Date: 2026-06-27

Use this document when upgrading a cloned `qitu` project or when applying future `qitu` changes to an app that already has business features.

## Upgrade Rule

Upgrade reusable infrastructure without moving business meaning into core packages.

Core packages may evolve contracts for:

1. Auth and sessions.
2. RBAC permissions.
3. Files and object metadata.
4. Jobs and queues.
5. Import/review/commit interfaces.
6. Audit events.
7. Email messages.
8. AI advisory artifacts.
9. UI primitives and design tokens.

Business apps own:

1. Feature adapters.
2. Staging tables.
3. Committed business tables.
4. Product-specific screens.
5. Product-specific calculations.
6. Product-specific chart semantics.

## Safe Upgrade Checklist

Before applying an upgrade:

1. Run `vp run verify:kit` on the source baseline.
2. Read `docs/release-notes.md` and `docs/decisions/decision-log.md`.
3. Identify migrations that affect reusable tables.
4. Identify package API changes in `packages/*`.
5. Confirm app-owned feature code still implements `ImportFeatureAdapter`.
6. Confirm no reusable package imports from `apps/*` or `examples/*`.

After applying an upgrade:

1. Run `vp install`.
2. Run `vp check --fix`.
3. Run `vp run smoke`.
4. Run `vp run verify:kit`.
5. Run the app's business-specific tests.
6. Run the relevant deployment dry-run before remote migration or deployment.

## Database Migrations

Migrations are append-only.

Do:

1. Add new migration files under `apps/worker/migrations`.
2. Keep local, preview, and production migration commands explicit.
3. Prefer additive columns and indexes for starter upgrades.
4. Document data backfills before production use.

Do not:

1. Edit applied migration files in a cloned app.
2. Put business-specific tables into generic docs as required core tables.
3. Store plaintext tokens, passwords, raw email bodies, or raw source files in D1.

## RBAC Changes

The starter baseline uses:

```text
owner
admin
reviewer
viewer
```

When adding permissions:

1. Add the permission to `packages/rbac`.
2. Guard the Worker write route with `requirePermission`.
3. Add an integration test for at least one allowed and one denied path.
4. Ensure denials write `rbac.denied`.
5. Update `docs/architecture/auth-security.md`.

Tenant-aware scopes should be added as a deliberate app or platform decision, not as a hidden change to the starter role table.

## Feature Adapter Changes

The core import pipeline should remain stable around:

```text
canHandle -> parse -> stage -> validate -> commitApproved
```

If a feature needs richer behavior:

1. Add it first to app-owned feature code.
2. Prove it through a vertical slice.
3. Extract only the reusable contract that at least two features need.
4. Keep example packages optional.
