CREATE TABLE IF NOT EXISTS ai_advisory_artifacts (
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
);

CREATE INDEX IF NOT EXISTS ai_advisory_artifacts_job_idx
  ON ai_advisory_artifacts (import_job_id, created_at);

CREATE INDEX IF NOT EXISTS ai_advisory_artifacts_status_idx
  ON ai_advisory_artifacts (status);
