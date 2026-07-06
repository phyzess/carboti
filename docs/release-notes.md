# Release Notes

Status: draft
Date: 2026-06-27

`qitu` is not versioned for npm publication yet. These notes describe reusable starter baselines that another team or agent can clone and adopt.

## Baseline: Runnable Kit

This baseline proves the reusable foundation with one complete vertical slice and one second adapter path.

Included:

1. React app shell with auth, source files, import jobs, review, AI advisory, commit/retry, and audit views.
2. Cloudflare Worker API with D1, R2, Queue, Email, and Static Assets configuration.
3. App-managed auth: invitation, accept, login, logout, `me`, password reset, session revocation, and auth audit events.
4. Minimal RBAC: `owner`, `admin`, `reviewer`, and read-only `viewer`; denied writes are audited as `rbac.denied`.
5. Source file intake with content-hash idempotency, R2 object storage, D1 metadata, queue dispatch, and audit.
6. Queue-backed import processing with app-owned starter adapters for text and JSON records, including invalid numeric text values staying in review instead of committing.
7. Human review with approve/reject decisions, AI advisory artifacts, human confirmation, commit, retry, and audit.
8. Business-neutral packages for auth, RBAC, files, jobs, import pipeline, audit, email, AI advisory, charts, UI, design system, config, db, and testing.
9. Copyable app and feature templates.
10. Agent entrypoints for Codex, Claude Code, and Pi-style planning agents.
11. Validation commands for static smoke, Worker runtime smoke, Worker integration, browser smoke, local migrations, Worker deploy dry-runs, and read-only failed-job operations.

Verified commands for this baseline are recorded in `docs/kit-completion.md`.

## Not Included

This baseline intentionally does not include:

1. Production Cloudflare account provisioning.
2. Public signup.
3. Social login or SSO.
4. Tenant-aware resource scopes.
5. Real AI provider integration.
6. A full chart catalog.
7. Business-specific parsers, tables, dashboards, or calculations.
8. Automatic DLQ consumers or replay automation for a real production queue.

## Compatibility Notes

Pinned toolchain:

1. TypeScript `7.0.1-rc`.
2. Vite+ `0.2.1`.
3. pnpm `11.5.2`.
4. Wrangler `4.103.0`.
5. React `19.2.3`.

Keep versions exact unless a decision record explains the change.
