# Capability Matrix

Status: draft
Date: 2026-07-02

Legend:

| Status           | Meaning                                                       |
| ---------------- | ------------------------------------------------------------- |
| Designed         | Architecture and decisions are documented.                    |
| Scaffolded       | Package or app shell exists.                                  |
| Runnable         | Local command path exists.                                    |
| Verified         | Covered by smoke, type, unit, integration, or runtime checks. |
| Production-ready | Ready for real users with operational runbooks.               |

## Current Matrix

| Capability            | Designed | Scaffolded | Runnable | Verified | Production-ready | Notes                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | -------- | ---------- | -------- | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React app shell       | Yes      | Yes        | Yes      | Partial  | No               | API-backed login, `/workspace` landing, protected Workspace and Settings route roots, account/logout, persisted English/Simplified Chinese language selection, member/invitation settings entry, source/import/review/audit pages, role-aware write controls, source/job diagnostics, import-to-review selected job context, frontend-only mock demo mode, and scripted browser smoke coverage. |
| Worker API shell      | Yes      | Yes        | Yes      | Partial  | No               | `apps/worker` exposes health/runtime primitives, HTTP source intake, inbound email intake, queue processing, and a minimal Cloudflare Vitest runtime smoke.                                                                                                                                                                                                                                     |
| Auth                  | Yes      | Yes        | Partial  | Partial  | No               | Invite links, accept page, login, protected routing, account/logout, admin user/invitation management with resend/revoke/delete-revoked, member hard delete guards, reset page, session revocation, security events, and audit paths are integrated.                                                                                                                                            |
| RBAC                  | Yes      | Partial    | Partial  | Partial  | No               | `@carboti/rbac` defines reusable permission helpers and a starter role policy; deployable apps own their canonical role policy; Worker write routes enforce permissions and audit/security-event `rbac.denied`; the React shell projects write permissions as read-only controls for viewer roles; multi-tenant scopes remain future work.                                                         |
| Files                 | Yes      | Yes        | Partial  | Partial  | No               | Authenticated upload and inbound email attachment intake write R2/D1/audit; source list API and upload UI are wired to the Worker API, with source rows showing related import-job status and hashes.                                                                                                                                                                                           |
| Jobs                  | Yes      | Partial    | Partial  | Partial  | No               | Upload creates queued import job; handler/local drain advance processing/needs_review/failed; failed jobs can be listed, retried, diagnosed through failure class/reason, mapped to page-local recovery guidance, and traced through `import_job_events`.                                                                                                                                       |
| Import pipeline       | Yes      | Partial    | Partial  | Partial  | No               | Worker registers app-owned text and JSON starter adapters; queue uses adapter parse/stage/validate, invalid numeric text stays in review, and commit uses `commitApproved`.                                                                                                                                                                                                                     |
| Human review          | Yes      | Partial    | Partial  | Partial  | No               | Review/decision/commit/retry API routes and API-backed demo console exist; handler and browser smoke cover approve, commit, reject.                                                                                                                                                                                                                                                             |
| Audit/security/alerts | Yes      | Partial    | Partial  | Partial  | No               | Sensitive paths write audit, including invitation lifecycle events; login attempts, security events, import job events, alert events, list APIs, server-backed audit filters, and web timeline/detail views exist for runtime visibility.                                                                                                                                                       |
| Email                 | Yes      | Partial    | Partial  | Partial  | No               | Invitation/reset templates, `store` and `send` delivery modes, `email_messages` delivery ledger, visible failed invite delivery with resend, Cloudflare `send_email`, React token landing pages, and business-neutral inbound email handling are wired.                                                                                                                                         |
| AI advisory           | Yes      | Partial    | Partial  | Partial  | No               | Local deterministic import-review advisory artifacts, list/generate/confirm/dismiss routes, web panel, audit events, and browser smoke coverage for generate/confirm are wired.                                                                                                                                                                                                                 |
| Charts                | Yes      | Yes        | Partial  | Partial  | No               | `@carboti/charts` exports dark, token-driven visx chart primitives with loading/empty/error/partial states.                                                                                                                                                                                                                                                                                        |
| Design system         | Yes      | Yes        | Yes      | Partial  | No               | Business-neutral qitu workbench tokens, shell, surfaces, metrics, data states, timeline, and review console composition are implemented.                                                                                                                                                                                                                                                        |
| Internationalization  | Yes      | Yes        | Yes      | Partial  | No               | `@carboti/i18n` provides reusable locale primitives, plural/relative-time helpers, and locale negotiation; `apps/web`, Worker auth routes, and email templates own their dictionaries and selection UX.                                                                                                                                                                                            |
| Feature templates     | Yes      | Yes        | Yes      | Partial  | No               | `templates/app` has a verified copy manifest and adoption commands; `templates/feature` is a typechecked copyable adapter with migration, fixture, web-surface, and registry replacement slots.                                                                                                                                                                                                 |
| Agent docs            | Yes      | Yes        | N/A      | Partial  | No               | Codex, Claude Code, and Pi entrypoints exist.                                                                                                                                                                                                                                                                                                                                                   |
| Cloudflare deployment | Yes      | Partial    | Partial  | Partial  | No               | Cloudflare Pages static demo commands exist for frontend-only review; local, preview, and production binding stubs exist; dry-run preflight checks public origins, Email Sending config, D1 placeholders, static assets, and queue DLQ; DLQ remediation, email deliverability, and deployment runbooks are wired, but no real preview/production account is provisioned.                        |

## Verification Targets

Near-term verification should be added in this order:

1. Static smoke checks for template invariants.
2. Worker handler integration with local D1/R2/Queue fakes.
3. Package type checks with TypeScript 7 RC.
4. Worker runtime tests covering Cloudflare Email Service, Queues, D1, and R2 binding behavior beyond the current minimal runtime smoke.
5. Broader adapter edge-case tests only when new real adapters add parser-specific risk.

## Production Readiness Gate

A capability becomes production-ready only when these are true:

1. It has tests that exercise success and failure paths.
2. It writes audit events for sensitive actions.
3. It has rate limits or abuse controls where relevant.
4. It has an operational recovery path.
5. It does not depend on AI output without human confirmation.
6. It has documented Cloudflare bindings and secrets.
