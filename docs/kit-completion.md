# Kit Completion Contract

Status: draft
Date: 2026-07-05

This document defines what "complete but not redundant" means for `qitu`.

## Objective

`qitu` is complete when it can be cloned by another team or agent and used to start a business-neutral, Cloudflare-first internal data application without private conversation context.

It is not complete when every possible feature is implemented. It is complete when the reusable foundations are proven by one working vertical slice and a second feature can be added without changing core semantics.

## Non-Redundant Principle

Add code only when it satisfies one of these conditions:

1. It is required by the first vertical slice.
2. It protects a reusable boundary.
3. It makes the starter easier to adopt safely.
4. It proves a decision that would otherwise remain speculative.

Do not add:

1. Business-specific models.
2. Unused abstractions.
3. Provider adapters without one local implementation path.
4. UI components that are not used by the starter shell, review flow, or templates.
5. Alternative technology choices after a decision has been recorded.

## Completion Scope

The final kit must include:

1. App-managed auth with invite, accept, login, protected routing, account/logout, admin member and invitation management, current user, password reset, session revocation, and audit events.
2. Minimal RBAC with invitation-assigned roles, guarded write routes, read-only viewer behavior, and audited denials.
3. Source file intake with authenticated upload, inbound email attachment intake, R2 storage, D1 metadata, import job creation, and audit events.
4. Queue-backed import processing with idempotent job state transitions, visible failures, retry classification, and audit events.
5. A generic import/review/commit workflow based on `ImportFeatureAdapter`.
6. One complete example feature that exercises parse, stage, review, approve, commit, and audit.
7. React app shell with login, account, member and invitation settings, source files, import jobs, review table, and audit timeline screens.
8. Business-neutral UI, design tokens, and chart primitives sufficient for data-heavy internal tools.
9. Email abstraction with a Cloudflare-compatible invite/reset delivery path and generic inbound receipt metadata.
10. AI advisory abstraction that stores advisory output and requires human confirmation before commit.
11. Cloudflare binding docs and commands for local setup, local migration, validation, deployment preparation, and DLQ/failed-job remediation.
12. Agent entrypoints for Codex, Claude Code, and Pi-style planning agents.
13. Templates for new apps and new feature slices, including migration, fixture, and web-surface replacement slots.

## Completion Gates

`qitu` is not complete until all gates pass:

1. `vp run verify:kit` passes.
2. Local D1 migrations apply from a clean state.
3. The first vertical slice can be exercised locally without manual database edits.
4. Smoke tests cover invite, login, upload, import job creation, review approval, commit, and audit visibility.
5. `docs/capability-matrix.md` has no false "production-ready" claims.
6. `docs/roadmap.md` shows no P0 or P1 item without an owner path.
7. No reusable package imports app-owned feature code.
8. No core package contains business-specific vocabulary.
9. `.env.example`, `apps/worker/.dev.vars.example`, and setup docs list every required binding or secret name.
10. A new feature can start from `templates/feature` without editing existing core packages, including its first migration, test fixture, and web surface descriptor.

## Last Verified

Date: 2026-07-06

Workspace: local filesystem baseline; no git metadata is required for this evidence.

Commands passed:

1. `vp check --fix`
2. `vp run smoke`
3. `vp run --filter @carboti/web typecheck`
4. `vp run --filter @carboti/worker typecheck`
5. `node scripts/worker-integration.mjs`
6. `vp run verify:kit`

Verified coverage added in this pass:

1. Worker integration covers inbound email with a top-level base64 attachment and a nested multipart quoted-printable attachment using `filename*=`.
2. Static smoke checks the app-owned review-store boundary instead of requiring generic Worker routes to hardcode starter table names.
3. `vp run verify:kit` revalidated smoke, full typecheck, formatting/lint, build, Worker runtime tests, local D1 migration, and browser smoke.
4. The Worker uses app-owned starter adapters and no longer depends on optional `examples/*` packages.
5. RBAC baseline covers owner/admin/reviewer/viewer roles, invitation-assigned user roles, viewer write denial, and `rbac.denied` audit evidence.
6. Release and upgrade notes document the current baseline and safe adoption path for cloned apps.
7. DLQ remediation is documented and `ops:failed-jobs` provides a read-only D1 recovery snapshot that exits cleanly after Wrangler reports success.
8. Audit filtering, selected-event details, invitation revocation, source/job diagnostics, recovery guidance, and import-to-review selected job context are covered by integration or browser smoke checks.
9. Browser smoke generates and confirms a deterministic AI advisory before approval/commit, then verifies `ai_advisory.confirmed` in the job event stream.
10. The app information architecture exposes only Workspace and Settings as primary navigation, with source/import/review routes under Workspace and account/members/audit under Settings.
11. Worker integration covers count-derived import job status after partial JSON commits, so pending rows keep the job in review until all approved rows are committed.
12. Deploy dry-run commands verify local Worker bindings through the Wrangler dry-run wrapper, while preview and production dry-runs run a preflight that blocks placeholder public URLs, unverified sender domains, placeholder D1 ids, missing Email bindings, and missing queue DLQs before bundling.
13. App adoption is covered by a dry-run-first script that plans package rename, Cloudflare resource rename, product-baseline pruning, and upstream remote safety steps.
14. `templates/feature` includes a replaceable migration, integration fixture, and web surface descriptor so a second feature slice can start without core edits.
15. RBAC keeps reusable permission helpers in `packages/rbac` while cloned apps can define app-owned role policies in their deployable entrypoints.
16. React orchestration helpers for audit filters, upload queue state, and permission projection are app-owned modules outside the top-level app component.
17. UI primitives now cover filter bars, data toolbars, detail drawers, and a command-search fixture used by the starter shell.
18. Confirmation aliases bridge user-facing confirm/exclude language to existing review approve/reject storage before any future schema migration.
19. Inbound email stores raw RFC822 messages, records receipt/attachment metadata, and hands supported attachments to the same source-file import job path as authenticated upload.
20. Worker and Web app composition files are split into app-owned route groups, page sections, controllers, and demo support modules while keeping reusable packages business-neutral.
21. Static smoke now checks the app-owned MIME parser entrypoint and helper modules for inbound email attachment extraction.
22. Package interface tests load the optional example packages and run their adapters through parse, stage, validate, and commit paths independently of the Worker starter adapters.
23. Static smoke reads full package/example source directories for thin facades, so package guards continue covering auth, database, i18n, import-pipeline, email, charts, UI, and example feature implementation modules.
24. `vp run verify:kit` passed after the package/example facade refactors, revalidating browser smoke and local D1 migration on the current worktree.
25. `vp run verify:kit` passed after the July locality refactors, revalidating smoke, full typecheck, formatting/lint, build, Worker runtime tests, local D1 migration, and browser smoke on the current worktree.

## Deliberately Out of Scope

These are not required for kit completion:

1. Multi-tenant billing.
2. Public user signup.
3. Social login.
4. A full design-system catalog.
5. Every chart type.
6. Every AI provider.
7. Every file parser.
8. Production deployment to a real Cloudflare account.
9. Business-specific dashboards.

## Review Cadence

After each vertical slice increment:

1. Update `docs/capability-matrix.md`.
2. Update `docs/guides/first-vertical-slice.md`.
3. Add or update smoke checks when an invariant becomes important.
4. Run `vp run validate`.
5. Record any technology or boundary decision in `docs/decisions/decision-log.md`.
