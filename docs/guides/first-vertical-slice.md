# First Vertical Slice

Status: draft
Date: 2026-06-27

The first implementation should prove the whole system path with the smallest useful business feature.

## Slice

```text
invite -> register -> login -> upload -> import job -> queue -> staging -> review -> advisory -> approve -> commit -> audit
```

## Why This Slice

It exercises the reusable parts that matter:

1. Auth.
2. Email.
3. File storage.
4. Async jobs.
5. Parser adapter.
6. Staging.
7. Human review.
8. AI advisory boundary.
9. Commit handler.
10. Audit trail.

It also exposes performance and runtime constraints early.

## Minimum Screens

1. Login.
2. Invite acceptance.
3. Source file list.
4. Upload dialog.
5. Import job detail.
6. Staging review table.
7. Audit event drawer or timeline.

## Minimum API Routes

1. Create invite.
2. Accept invite.
3. Login.
4. Logout.
5. Request password reset.
6. Upload file.
7. List source files.
8. Create import job.
9. List import jobs.
10. Get import job review detail.
11. List staging records.
12. Approve staged records.
13. Reject staged records.
14. List/generate/confirm/dismiss AI advisories.
15. Commit confirmed records.
16. List audit events.

## Minimum Worker Jobs

1. Parse source file.
2. Validate parsed records.
3. Create staging records.
4. Mark job completed or failed.

## Done Means

1. A user can complete the slice without manual database edits.
2. Failed jobs keep enough detail for debugging.
3. A second parser can be added without rewriting the pipeline.
4. Every commit has a reviewer and an audit trail.
5. No AI advisory result is committed without human confirmation.

## Implementation Order

Build this as tracer-bullet work, not as separate horizontal layers.

### 1. Auth Bootstrap

Status:

```text
baseline routes, local setup UI, emailed token landing pages, password reset, and email metadata scaffolded
```

Deliver:

1. Admin-created invitation.
2. Email invite token.
3. Invite acceptance page.
4. Password setup.
5. Login and logout.
6. Session cookie.

Validation:

1. Invite token expires.
2. Token is stored as a hash.
3. Existing sessions revoke after password reset.
4. Permission failures write audit/security events.

Current verification:

1. Dedicated emailed invite acceptance and reset landing pages are implemented in the React app.
2. Integration tests cover invitation, login, password reset, session revocation, email metadata, and audit.
3. Browser smoke covers opening an invite link, accepting the invitation, opening a password reset link, resetting the password, and logging in with the new password.

### 2. Source File Intake

Status:

```text
baseline route and upload UI scaffolded
```

Deliver:

1. Upload UI.
2. Worker upload route.
3. R2 object write.
4. Source file metadata row.
5. Audit event.

Validation:

1. Duplicate uploads are idempotent by content hash or explicit source key.
2. Raw file content is not written to logs.

Current verification:

1. Browser smoke covers upload UI against local Worker dev.
2. Integration tests cover authenticated upload, R2 write, D1 metadata, queue dispatch, idempotency, and audit.
3. Source download is outside the starter completion contract; apps that add it later must permission-check and audit it in app-owned routes.

### 3. Import Job

Status:

```text
state machine, two app-owned starter adapters, failure classification, and manual retry scaffolded
```

Deliver:

1. Create import job from source file.
2. Queue message.
3. Worker consumer.
4. Job status transitions.
5. Failure reason storage.

Validation:

1. Retrying a message does not double-commit.
2. Failed jobs are visible.
3. Job timeline can explain what happened.

Current verification:

1. Queue processing uses registered text and JSON starter adapters for parse, stage, validate, and commit.
2. Demo staging and commit tables exist for the examples; real apps still replace them with feature-owned tables.
3. Failed jobs store failure class/reason and can be manually retried.
4. Queue consumers declare `max_retries` and DLQ names in `apps/worker/wrangler.jsonc`; recovery remains manual through the app/API retry path and DLQ runbook.
5. Integration tests cover queue -> adapter staging -> review -> adapter commit for both starter adapters and source-missing retry.
6. Browser flow can use the local-only drain route while Wrangler local Queue consumer behavior is verified separately.

### 4. Feature Adapter

Deliver:

1. `ImportFeatureAdapter` implementation.
2. Parser.
3. Staging payload.
4. Review issues.
5. `commitApproved` handler with reviewer and idempotency context.

Validation:

1. Core packages do not import feature code.
2. A second adapter can be registered without changing the import pipeline contract.
3. Feature-owned validation decides business correctness.

### 5. Review and Commit

Status:

```text
API baseline scaffolded and handler integration verified
```

Deliver:

1. Staging table.
2. Approve/reject controls.
3. Reviewer note.
4. Commit confirmed records.
5. Audit trail.

Validation:

1. Commit requires reviewer identity.
2. Rejected records are not committed.
3. Commit is idempotent.
4. AI advisory output cannot commit without reviewer confirmation.

Current verification:

1. Worker routes exist for review, approve, reject, commit, and retry.
2. React review table, source file panel, job list, AI advisory panel, commit action, retry action, and audit timeline load through the API client.
3. AI advisory list/generate/confirm/dismiss routes and web panel are wired with local deterministic output.
4. Scripted browser smoke covers local setup, upload, queue drain, review approval, commit, review rejection, and audit.
5. The demo commit table is intentionally example-owned; real apps must provide their own commit target.
6. Handler integration covers invite, login, password reset, upload, queue, adapter staging, AI advisory, review approval, adapter commit, duplicate upload, duplicate commit, source-missing retry, and audit visibility.
7. Browser smoke covers the AI advisory panel by generating a local deterministic advisory, confirming it, and checking the import job event stream.
8. Additional adapter-specific failure classes should be added with real feature adapters rather than invented in the neutral starter.

## Initial Issues

The first implementation can be split into these independently reviewable issues:

1. Build auth invitation and session baseline.
2. Add source file upload and R2 metadata.
3. Add import job state machine and queue consumer.
4. Implement one starter import feature adapter.
5. Add staging review UI and approve/reject API.
6. Add commit flow with audit events.
7. Add password reset and email delivery baseline.
8. Add failure visibility and retry controls.
