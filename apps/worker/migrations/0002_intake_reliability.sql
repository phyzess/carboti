ALTER TABLE source_files ADD COLUMN content_hash TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS source_files_workspace_content_hash_idx
  ON source_files (workspace_id, content_hash);

ALTER TABLE import_jobs ADD COLUMN failure_reason TEXT;
ALTER TABLE import_jobs ADD COLUMN processing_started_at TEXT;
ALTER TABLE import_jobs ADD COLUMN completed_at TEXT;

CREATE INDEX IF NOT EXISTS import_jobs_status_idx ON import_jobs (status);
