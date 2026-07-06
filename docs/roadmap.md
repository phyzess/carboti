# Roadmap

`qitu` should grow through real vertical slices, not through speculative generalization.

## Phase 0: Architecture Seed

Status:

```text
baseline complete
```

Goals:

1. Establish project identity.
2. Define package boundaries.
3. Define agent entry points.
4. Define first vertical slice.
5. Keep the core business-neutral.

Exit criteria:

1. `README.md` explains the project clearly.
2. Architecture docs describe the reusable core.
3. Agent docs tell Codex, Claude Code, and planning agents how to work here.
4. No business-specific vocabulary is required to understand the core.

## Phase 1: Skeleton App

Status:

```text
done
```

Goals:

1. Create workspace structure.
2. Add React app shell.
3. Add Worker API shell.
4. Add shared config package.
5. Add DB migrations.
6. Add local commands for typecheck, tests, and migrations.

Exit criteria:

1. One command starts local development.
2. One command validates the repo.
3. One command prepares Cloudflare bindings.
4. The app can render a protected shell after login.

Current baseline:

1. The app shell renders and the local reviewer setup/login UI is wired to the Worker API.
2. Deployment preparation includes local, preview, and production binding stubs, same-origin Worker Static Assets, and Queue DLQ configuration; provisioning a real Cloudflare account remains an environment-specific deployment step.

## Phase 2: First Vertical Slice

Status:

```text
baseline complete
```

Goals:

1. Invite a user.
2. Register from invite.
3. Login with email and password.
4. Upload a source file.
5. Store it in R2.
6. Create an import job.
7. Process the job asynchronously.
8. Write staging records.
9. Review and approve records.
10. Commit business-owned records.
11. Write audit events.

Exit criteria:

1. An example feature can complete the entire path.
2. Core packages do not know example-specific fields.
3. Failed jobs are visible and retryable.
4. Review decisions are traceable.

Current P0 baseline completed:

1. Auth bootstrap.
2. Source file intake.
3. Import job state machine.
4. Review staging and approval.
5. Commit with audit.
6. Password reset and email delivery baseline.
7. Emailed invite and password-reset landing pages.
8. Adapter-driven parse/stage/validate/commit for the app-owned starter feature.
9. Failure visibility, failure classification, and manual retry controls.
10. Browser coverage for both approved/commit and rejected review decisions.
11. A second JSON records feature adapter proving the registry path without changing core semantics.
12. AI advisory artifacts with local deterministic generation, human confirm/dismiss, web panel, and audit.
13. Minimal RBAC with invitation-assigned roles, guarded write routes, read-only viewer behavior, and audited denials.
14. Adapter validation edge-case coverage for invalid numeric source data staying in review and blocked from commit.
15. DLQ and failed-job remediation runbook with a read-only D1 failed-job snapshot command.

P1 follow-up status:

None. An automatic DLQ consumer is intentionally out of scope until real queue operations prove manual recovery is insufficient.

Current verification:

1. `vp run smoke` covers the Worker handler path from invite to audit visibility with local D1/Email/R2/Queue fakes, including password reset, role preservation, viewer RBAC denial, text adapter staging/commit, invalid numeric validation staying in review, JSON adapter staging/commit, AI advisory generation/confirmation, failure classification, manual retry, and session revocation.
2. The React console calls the Worker API client for local setup/login/password reset, upload, source files, jobs, local queue drain, review decisions, AI advisory, commit, manual retry, and audit.
3. `vp run test:worker-runtime` uses the official Cloudflare Vitest pool to verify `/health` and unauthenticated upload rejection inside the Workers runtime.
4. `vp run smoke:browser` starts local Web/Worker dev and exercises invite link acceptance, password reset link confirmation, login, upload, queue drain, approve, commit, reject, and audit in Chromium.
5. `vp run ops:failed-jobs` provides a read-only operator snapshot for failed, queued, and processing import jobs.

## Phase 3: Second Feature Test

Status:

```text
baseline complete
```

Goals:

1. `examples/json-records` adds a second concrete feature.
2. It reuses the same auth, file, job, review, audit, and email packages.
3. The Worker registry selects it by `.json` file name or `application/json` content type.

Exit criteria:

1. The second feature adds no new core concepts.
2. Core package contracts did not change.
3. Smoke and package interface tests verify both optional example packages independently of the Worker starter adapters.

## Phase 4: Extraction Quality

Status:

```text
baseline complete; future extraction hardening tracked
```

Goals:

1. Stabilize package APIs.
2. Maintain templates for new apps and new feature slices.
3. Add smoke tests for generated apps.
4. Add release notes and upgrade notes.

Exit criteria:

1. A new app can start from `templates/app/manifest.json`.
2. A new feature can be added from `templates/feature`.
3. The repo can be adopted by another agent without private context.

Current verification:

1. `templates/app/manifest.json` is checked by smoke for missing copy paths.
2. `templates/feature` is a workspace package with a typechecked `ImportFeatureAdapter` and app-owned registry starter.
3. Release and upgrade notes describe the current starter baseline and safe adoption path.

## Phase 5: Product-Grade Starter Hardening

Status:

```text
baseline complete
```

Goal:

Turn the runnable baseline into a startup kit that feels coherent enough for another team or agent to clone, run, understand, and extend without discovering obvious UX or workflow contradictions.

Boundary:

Keep this hardening business-neutral. Improvements should live in the app-owned shell, Worker routes, reusable qitu UI primitives, documentation, or verification scripts. They must not add business metrics, business parser fields, business workflows, or business reports to `packages/*`.

Completed requirements:

1. Page metrics and labels must describe the real data scope they show.
2. Cross-page actions must preserve workflow context, especially the selected import job between imports and reviews.
3. The React shell must project RBAC clearly: viewers should see read-only affordances before a guarded route returns `403`.
4. Each route should expose useful empty, error, and blocked states rather than relying on a hidden top-level error.
5. Review pages should distinguish selected-job review state from workspace-wide state.
6. The audit settings page should become a useful visibility tool through filtering, details, and clear actor/subject context.
7. Member and invitation settings should cover the invitation lifecycle expected of an internal app starter.
8. Browser smoke or integration checks should cover the workflow invariants that users can break from the UI.

First hardening increment:

1. Make the first pass of role-aware UI controls match the existing RBAC permissions.
2. Preserve selected job context when opening Reviews from Imports.
3. Rename and compute overview/review labels so they do not imply stronger data than the UI actually has.
4. Show non-review route errors inside the authenticated workbench.

Second hardening increment:

1. Make the audit route a useful settings visibility page, not only a passive timeline.
2. Add server-backed audit filters for action, actor, subject kind, and subject id.
3. Show selected audit-event details, including actor, subject, timestamp, and metadata.
4. Cover audit filtering in Worker integration and browser smoke.

Third hardening increment:

1. Add an authenticated invitation revocation route guarded by the existing invitation-management permission.
2. Write `invitation.revoked` audit events when pending invitations are revoked.
3. Show invitation lifecycle timestamps and revoke actions in the Users route.
4. Cover invitation revocation through Worker integration and browser smoke.

Fourth hardening increment:

1. Show source-file-to-import-job linkage on the Sources route.
2. Turn the Imports inspector into a job diagnostics panel with status, adapter, attempts, failure class/reason, timestamps, and content hash.
3. Reuse `import_job_events` as the Imports route event stream so failures and retries are visible before opening Reviews.
4. Cover the diagnostics panel in browser smoke.

Fifth hardening increment:

1. Show a page-local recovery path for failed, queued, processing, and review-ready import jobs.
2. Map failure classes to neutral remediation guidance from the DLQ runbook.
3. Put the retry action inside the selected job diagnostics panel while preserving RBAC-disabled states.
4. Cover a real failed JSON import and recovery guidance in browser smoke.

Sixth hardening increment:

1. Cover the AI advisory panel in browser smoke as part of the first vertical slice.
2. Generate a local deterministic advisory from the Review route.
3. Confirm the advisory through the UI before record approval and commit.
4. Assert the import job event stream shows `ai_advisory.confirmed`.

Seventh hardening increment:

1. Consolidate primary navigation to only Workspace and Settings.
2. Keep source upload, import diagnostics, and review workflows under `/workspace`.
3. Keep account, member/invitation management, and audit visibility under `/settings`.
4. Drop pre-release compatibility redirects for old flat route paths.
5. Derive import job status from staged-record counts so partial commits keep jobs in review while pending rows remain.

## Phase 6: Downstream Adoption Feedback Hardening

Status:

```text
baseline complete
```

Goal:

Fold real cloned-app feedback back into the starter without turning `qitu` into a business app.

Boundary:

Keep downstream concerns app-owned. The starter may provide scripts, templates, seams, and business-neutral primitives, but reusable packages must not gain business-specific roles, fields, workflows, reports, or parser assumptions.

Completed requirements:

1. Add a dry-run-first adoption script for app rename, Cloudflare resource rename, product-baseline pruning, and upstream remote safety.
2. Expand `templates/feature` into a replaceable slice with a migration, integration fixture, registry export, and web-surface descriptor.
3. Move app-specific role policy into deployable app entrypoints while keeping generic permission helpers in `packages/rbac`.
4. Harden auth email delivery with `store`/`send` modes, delivery ledger visibility, failed-delivery resend, and public-origin link generation.
5. Complete the starter member/invitation management loop with resend, revoke, delete revoked, member hard delete guards, shared auth validation, deployment preflight, and email deliverability guidance.
6. Split bulky React orchestration helpers out of the top-level app component into app-owned modules.
7. Add reusable UI pattern primitives for filter bars, data toolbars, detail drawers, and command-search fixture composition.
8. Introduce confirmation semantic aliases so user-facing confirm/exclude language can coexist with existing approve/reject storage until a future migration.
9. Add a business-neutral inbound email intake slice that stores raw messages, records receipt metadata, and hands supported attachments to source-file import jobs.

Current verification:

1. Smoke checks guard adoption manifest/script invariants, template feature replacement slots, RBAC policy seams, UI primitive usage, confirmation aliases, and inbound email wiring.
2. Package interface tests SSR-load the feature template registry and verify custom RBAC policy and confirmation alias contracts.
3. Worker integration covers inbound email attachment intake through local D1/R2/Queue fakes.
4. Typecheck covers the Worker email handler, shared schemas, app-owned RBAC helpers, and new UI primitives.

## Completion Gate

The final target is defined in `docs/kit-completion.md`.

The project is complete only when:

1. All P0 items in this roadmap are implemented.
2. `docs/capability-matrix.md` matches the actual implementation state.
3. `vp run verify:kit` passes.
4. A local clean D1 migration applies.
5. The first vertical slice can be completed without manual database edits.
