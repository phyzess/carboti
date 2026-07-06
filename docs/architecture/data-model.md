# Generic Data Model

Status: draft
Date: 2026-07-02

## 1. Purpose

This document defines the generic tables that belong to `qitu` core. Domain tables are intentionally excluded.

## 2. Table Groups

```text
auth
source files
email
import pipeline
ai advisory
audit/security/alerts
```

`packages/db/src/index.ts` is the `@carboti/db` package interface facade. Drizzle table definitions live
in focused package-internal modules by table group: auth, source/import, review, AI advisory, email,
and event tables. The facade re-exports the same table names for callers; splitting modules is an
implementation-locality change, not a migration or schema change.

## 3. Auth Tables

Current migration baseline uses these implemented tables:

```text
users, including role via migration 0006
invitations
password_credentials
sessions
password_reset_tokens
login_attempts
```

The schemas below describe the broader target auth model. The current implementation uses the table names above, while preserving the same capability boundaries.

```text
users
user_identities
user_sessions
user_invitations
password_reset_tokens
login_attempts
```

### `users`

```sql
users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by_user_id TEXT,
  invited_at TEXT,
  activated_at TEXT,
  last_login_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

Default statuses:

```text
invited
active
suspended
disabled
```

### `user_identities`

```sql
user_identities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_subject TEXT,
  password_hash TEXT,
  password_params TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

### `user_sessions`

```sql
user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  absolute_expires_at TEXT NOT NULL,
  revoked_at TEXT,
  last_seen_at TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT
)
```

### `user_invitations`

```sql
user_invitations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invite_token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  invited_by_user_id TEXT NOT NULL,
  accepted_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

### `password_reset_tokens`

```sql
password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  used_at TEXT,
  revoked_at TEXT
)
```

### `login_attempts`

```sql
login_attempts (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  user_id TEXT,
  outcome TEXT NOT NULL,
  failure_reason TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  request_id TEXT,
  created_at TEXT NOT NULL
)
```

## 4. Source File Tables

### `source_files`

```sql
source_files (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  object_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER,
  uploaded_by TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  content_hash TEXT
)
```

The core table stores what the file is physically. The Worker writes bytes to the configured R2
binding and stores the object key here; the D1 table does not store a bucket column. App-owned
feature code decides what the file means.

## 5. Email Tables

The current outbound email baseline stores delivery metadata only. It is used for both `store` mode
and `send` mode so invitation and password-reset flows can show whether an email was only recorded,
sent through Cloudflare Email Service, or failed before/while sending:

```sql
email_messages (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_message_id TEXT,
  error_message TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  sent_at TEXT
)
```

Raw bodies should live in R2. D1 stores delivery metadata and minimal extracted text only.

For invitation email, `metadata_json` includes the invitation id so admin views can show the latest
delivery status and support resend without storing plaintext tokens.

The current inbound email baseline uses separate receipt and attachment tables. Raw RFC822 bodies
are stored in R2, and accepted attachments are handed to source-file intake:

```sql
inbound_email_messages (
  id TEXT PRIMARY KEY,
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  raw_object_key TEXT NOT NULL,
  raw_size INTEGER NOT NULL,
  attachment_count INTEGER NOT NULL,
  status TEXT NOT NULL,
  metadata_json TEXT,
  received_at TEXT NOT NULL
)

inbound_email_attachments (
  id TEXT PRIMARY KEY,
  inbound_email_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  source_file_id TEXT,
  import_job_id TEXT,
  object_key TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TEXT NOT NULL
)
```

Do not overload `email_messages` with raw inbound email body storage.

## 6. Import Pipeline Tables

Current migration baseline:

1. `import_jobs` stores source file, status, adapter/job metadata, idempotency key, attempt count, and structured failure class.
2. `import_review_issues`, `import_review_decisions`, and `import_review_record_decisions` are core-owned and use opaque `staged_record_key` values.
3. `example_staged_records` and `example_committed_records` are example-owned demo tables. Real apps should replace them with feature-owned staging and commit tables.

The schemas below describe the broader target model and may be richer than the current migration baseline.

### `import_jobs`

```sql
import_jobs (
  id TEXT PRIMARY KEY,
  source_file_id TEXT NOT NULL,
  job_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  parser_version TEXT NOT NULL,
  rule_version TEXT NOT NULL,
  requested_by_user_id TEXT,
  reviewed_by_user_id TEXT,
  approved_by_user_id TEXT,
  rejected_by_user_id TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  warning_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  conflict_count INTEGER NOT NULL DEFAULT 0,
  idempotency_key TEXT NOT NULL,
  queued_at TEXT,
  started_at TEXT,
  parsed_at TEXT,
  reviewed_at TEXT,
  approved_at TEXT,
  committed_at TEXT,
  rejected_at TEXT,
  failed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

### `import_job_events`

```sql
import_job_events (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  source_file_id TEXT,
  event_type TEXT NOT NULL,
  status_from TEXT,
  status_to TEXT,
  actor_user_id TEXT,
  message TEXT,
  metadata_json TEXT,
  request_id TEXT,
  created_at TEXT NOT NULL
)
```

### `import_review_issues`

```sql
import_review_issues (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  entity_type TEXT,
  row_key TEXT,
  field_name TEXT,
  message TEXT NOT NULL,
  expected_json TEXT,
  actual_json TEXT,
  created_at TEXT NOT NULL
)
```

### `import_errors`

```sql
import_errors (
  id TEXT PRIMARY KEY,
  import_job_id TEXT,
  import_kind TEXT NOT NULL,
  import_id TEXT,
  severity TEXT NOT NULL,
  row_number INTEGER,
  field_name TEXT,
  message TEXT NOT NULL,
  raw_value TEXT,
  created_at TEXT NOT NULL
)
```

## 7. AI Advisory Tables

Current migration baseline:

```sql
ai_advisory_artifacts (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  summary TEXT NOT NULL,
  output_json TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  confirmed_by TEXT,
  confirmed_at TEXT,
  dismissed_by TEXT,
  dismissed_at TEXT
)
```

Advisory artifacts are not business truth. They record model or local-helper output plus human disposition. Commit routes must continue to read approved staging records, not AI advisory status.

## 8. Event Tables

Current migration baseline implements:

```text
audit_events
login_attempts
import_job_events
security_events
alert_events
```

`audit_events` remains the durable compliance trail for sensitive actions. The newer event tables support runtime visibility: login attempts for auth diagnostics, `security_events` for abuse/RBAC signals, `import_job_events` for job-local timeline views, and `alert_events` for operational follow-up.

### `audit_events`

```sql
audit_events (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_kind TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  subject_kind TEXT NOT NULL,
  metadata_json TEXT,
  occurred_at TEXT NOT NULL
)
```

### `security_events`

```sql
security_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  actor_user_id TEXT,
  target_user_id TEXT,
  action TEXT NOT NULL,
  outcome TEXT NOT NULL,
  request_id TEXT,
  session_id TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL
)
```

### `alert_events`

```sql
alert_events (
  id TEXT PRIMARY KEY,
  severity TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  title TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  acknowledged_by_user_id TEXT,
  acknowledged_at TEXT,
  resolved_at TEXT
)
```

## 9. Business-Owned Tables

Business-owned tables are intentionally not specified here. An app-owned feature may define:

1. Staging tables.
2. Business-owned tables.
3. Business-specific history tables.
4. Business-specific calculation outputs.

The feature must connect them to core through:

1. `source_file_id`
2. `import_job_id`
3. `audit_events`
4. business-specific commit keys
