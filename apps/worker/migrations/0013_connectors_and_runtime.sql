CREATE TABLE IF NOT EXISTS carboti_connector_health_checks (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  connector_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  details_json TEXT
);

CREATE INDEX IF NOT EXISTS carboti_connector_health_checks_source_checked_idx
  ON carboti_connector_health_checks (source_id, checked_at);

CREATE INDEX IF NOT EXISTS carboti_connector_health_checks_workspace_status_idx
  ON carboti_connector_health_checks (workspace_id, status, checked_at);

CREATE TABLE IF NOT EXISTS carboti_sinks (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  config_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_sinks_workspace_kind_idx
  ON carboti_sinks (workspace_id, kind);
