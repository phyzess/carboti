ALTER TABLE import_jobs ADD COLUMN job_kind TEXT;
ALTER TABLE import_jobs ADD COLUMN adapter_id TEXT;
ALTER TABLE import_jobs ADD COLUMN idempotency_key TEXT;
ALTER TABLE import_jobs ADD COLUMN attempt_count INTEGER DEFAULT 0;
ALTER TABLE import_jobs ADD COLUMN failure_class TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS import_jobs_idempotency_key_idx
  ON import_jobs (idempotency_key);

CREATE TABLE IF NOT EXISTS import_review_issues (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  staged_record_key TEXT NOT NULL,
  code TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS import_review_issues_job_idx
  ON import_review_issues (import_job_id);

CREATE INDEX IF NOT EXISTS import_review_issues_record_idx
  ON import_review_issues (import_job_id, staged_record_key);

CREATE UNIQUE INDEX IF NOT EXISTS import_review_issues_job_record_code_idx
  ON import_review_issues (import_job_id, staged_record_key, code);

CREATE TABLE IF NOT EXISTS import_review_decisions (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  action TEXT NOT NULL,
  reviewer_user_id TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS import_review_decisions_job_idx
  ON import_review_decisions (import_job_id);

CREATE TABLE IF NOT EXISTS import_review_record_decisions (
  id TEXT PRIMARY KEY,
  decision_id TEXT NOT NULL,
  import_job_id TEXT NOT NULL,
  staged_record_key TEXT NOT NULL,
  action TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS import_review_record_decisions_job_idx
  ON import_review_record_decisions (import_job_id);

CREATE INDEX IF NOT EXISTS import_review_record_decisions_record_idx
  ON import_review_record_decisions (import_job_id, staged_record_key);

CREATE TABLE IF NOT EXISTS example_staged_records (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  source_file_id TEXT NOT NULL,
  staged_record_key TEXT NOT NULL,
  source_row_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  review_status TEXT NOT NULL,
  committed_record_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS example_staged_records_job_key_idx
  ON example_staged_records (import_job_id, staged_record_key);

CREATE INDEX IF NOT EXISTS example_staged_records_job_status_idx
  ON example_staged_records (import_job_id, review_status);

CREATE TABLE IF NOT EXISTS example_committed_records (
  id TEXT PRIMARY KEY,
  import_job_id TEXT NOT NULL,
  source_file_id TEXT NOT NULL,
  staged_record_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  committed_by TEXT NOT NULL,
  committed_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS example_committed_records_job_key_idx
  ON example_committed_records (import_job_id, staged_record_key);
