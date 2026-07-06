# Import Pipeline

Status: draft
Date: 2026-06-27

## 1. Purpose

The import pipeline is the central reusable workflow in `qitu`.

It turns unknown or semi-structured inputs into confirmed, auditable, business-owned data.

## 2. Flow

```text
source file
-> source_files
-> import_jobs
-> queue
-> feature parser
-> feature staging
-> human confirmation
-> feature commit
-> audit_events
```

## 3. Core Owns

Core packages own:

1. Source file metadata.
2. Raw file storage.
3. Import job lifecycle.
4. Queue message envelope.
5. Generic review issue lifecycle.
6. Approve/reject/void decision records, with confirmation-language aliases for app UI.
7. Audit hooks.

Core does not own business staging payloads or business commit tables.

## 4. Feature Owns

Business-owned feature code owns:

1. Source matching.
2. File parser.
3. Parsed record shape.
4. Staging shape.
5. Validation rules.
6. `commitApproved` logic.
7. Business-owned tables.
8. Confirmation UI copy.

## 5. Import Feature Adapter

The generic adapter shape lives in `@carboti/import-pipeline`:

```ts
type ImportFeatureAdapter<TParsed, TStaged, TCommitted> = {
  id: string;
  canHandle(source: { filename: string; contentType: string }): boolean;
  parse(source: ReadableStream<Uint8Array>): Promise<TParsed[]>;
  stage(parsed: TParsed[]): Promise<TStaged[]>;
  validate(staged: TStaged): ReviewIssue[];
  commitApproved(input: {
    records: TStaged[];
    context: CommitApprovedContext;
  }): Promise<TCommitted[]>;
};
```

The adapter is intentionally narrow. It does not prescribe where app-owned feature code lives.

`CommitApprovedContext` must include the import job, confirmer identity, approved staged record keys, and an idempotency key. This prevents an adapter from treating commit as a raw data write detached from confirmation.

`packages/import-pipeline/src/index.ts` is the package interface facade. Schemas and generic types,
the adapter contract, manual review issue factory, staging key conventions, review/confirmation
action aliases, and job status derivation live in focused package-internal modules behind that same
package import path.

## 6. Confirmation Decision

Review decisions should be explicit and auditable:

```ts
type ReviewDecision = {
  importJobId: string;
  reviewerId: string;
  action: "approve" | "reject" | "void";
  note?: string;
  rowDecisions?: Array<{
    stagedRecordId: string;
    action: "approve" | "reject";
    note?: string;
  }>;
};
```

The current database and event taxonomy still use the stable internal
`approve`/`reject` action names. User-facing surfaces may use
`confirm`/`exclude` through the `@carboti/import-pipeline` alias helpers:

```ts
reviewActionForConfirmationAction("confirm"); // "approve"
reviewActionForConfirmationAction("exclude"); // "reject"
confirmationStatusForStagedStatus("approved"); // "confirmed"
confirmationStatusForStagedStatus("rejected"); // "excluded"
```

Migration rule:

1. UI copy can use confirmation language now.
2. App routes can expose confirmation-language endpoints such as `confirm-pending`.
3. Internal route keys, permission names, event names, and D1 statuses stay compatible until
   a deliberate schema migration is planned.
4. A future migration may rename storage fields only when the app can migrate audit readers,
   smoke tests, and downstream route contracts together.

Job status is derived from staged-record status counts after review and commit actions:

1. Any approved, uncommitted staged record keeps the job `approved`, because there is work ready to commit.
2. Pending staged records without approved work keep the job `needs_review`, including after a partial commit.
3. A job becomes `committed` only after approved rows have been committed and no staged records remain pending or approved.
4. Rejected-only jobs stay `needs_review` in the neutral starter because there is no separate job-level rejected status.

## 7. Idempotency Requirements

Import work must be safe to retry:

1. Queue messages carry stable `jobId`.
2. Source file object keys are stable.
3. Staging writes are keyed by import job and source row identity when possible.
4. Commit operations must avoid duplicate business-owned rows.
5. Audit events should describe retries without hiding the original failure.

The starter Worker currently includes app-owned `example_staged_records` and `example_committed_records` tables to prove the path. Real applications should replace those with feature-owned tables without changing core review decisions.

Worker review routes and the import job runner access staged and committed rows through the
app-owned `WorkerReviewStore` boundary in `apps/worker/src/import-review-store.ts`. The starter
implementation lives in `apps/worker/src/features/starter-review-*` modules, which are the only
generic Worker modules allowed to know the `example_*` table names. A real feature should provide
its own store beside its adapter so review list, decision, commit, stats, audit subject kind, and AI
advisory counts stay generic.

## 8. Failure Classes

The reusable pipeline should distinguish:

1. Unsupported source.
2. Parse error.
3. Missing required business fields.
4. Invalid business date or number.
5. Duplicate source.
6. Duplicate target record.
7. Commit conflict.
8. Infrastructure failure.

Failures should be visible and retryable unless the adapter marks them as terminal.

The current web starter exposes that visibility in the Imports route: the selected job inspector shows status, adapter, attempt count, failure class, failure reason, timestamps, source hash, recovery guidance, RBAC-aware retry action, and the `import_job_events` stream before the user opens the Review route.
