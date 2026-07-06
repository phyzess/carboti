CREATE TABLE IF NOT EXISTS login_attempts (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  user_id TEXT,
  outcome TEXT NOT NULL,
  failure_reason TEXT,
  ip_hash TEXT,
  user_agent_hash TEXT,
  request_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS login_attempts_email_created_idx
  ON login_attempts (email_hash, created_at);

CREATE INDEX IF NOT EXISTS login_attempts_user_created_idx
  ON login_attempts (user_id, created_at);

CREATE TABLE IF NOT EXISTS import_job_events (
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
);

CREATE INDEX IF NOT EXISTS import_job_events_job_created_idx
  ON import_job_events (import_job_id, created_at);

CREATE INDEX IF NOT EXISTS import_job_events_type_created_idx
  ON import_job_events (event_type, created_at);

CREATE TABLE IF NOT EXISTS security_events (
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
);

CREATE INDEX IF NOT EXISTS security_events_type_created_idx
  ON security_events (event_type, created_at);

CREATE INDEX IF NOT EXISTS security_events_actor_created_idx
  ON security_events (actor_user_id, created_at);

CREATE TABLE IF NOT EXISTS alert_events (
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
);

CREATE INDEX IF NOT EXISTS alert_events_status_created_idx
  ON alert_events (status, created_at);

CREATE INDEX IF NOT EXISTS alert_events_entity_created_idx
  ON alert_events (entity_type, entity_id, created_at);
