CREATE TABLE IF NOT EXISTS carboti_sources (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  config_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_sources_workspace_kind_idx
  ON carboti_sources (workspace_id, kind);

CREATE TABLE IF NOT EXISTS carboti_pipelines (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  source_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  config_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_pipelines_source_idx
  ON carboti_pipelines (source_id, status);

CREATE TABLE IF NOT EXISTS carboti_processor_configs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  endpoint_url TEXT,
  timeout_seconds INTEGER,
  status TEXT NOT NULL,
  config_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_processor_configs_workspace_kind_idx
  ON carboti_processor_configs (workspace_id, kind);

CREATE TABLE IF NOT EXISTS carboti_processor_runs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  processor_id TEXT NOT NULL,
  pipeline_id TEXT,
  message_id TEXT,
  status TEXT NOT NULL,
  input_object_id TEXT,
  output_artifact_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS carboti_processor_runs_processor_started_idx
  ON carboti_processor_runs (processor_id, started_at);

CREATE INDEX IF NOT EXISTS carboti_processor_runs_message_started_idx
  ON carboti_processor_runs (message_id, started_at);

CREATE TABLE IF NOT EXISTS carboti_artifacts (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  message_id TEXT,
  processor_run_id TEXT,
  schema_id TEXT,
  object_key TEXT,
  content_type TEXT,
  content_hash TEXT,
  size INTEGER,
  data_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_artifacts_message_kind_idx
  ON carboti_artifacts (message_id, kind, created_at);

CREATE INDEX IF NOT EXISTS carboti_artifacts_processor_idx
  ON carboti_artifacts (processor_run_id, created_at);

CREATE TABLE IF NOT EXISTS carboti_lineage_edges (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  from_object_id TEXT NOT NULL,
  to_object_id TEXT NOT NULL,
  relation TEXT NOT NULL,
  processor_run_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_lineage_edges_from_idx
  ON carboti_lineage_edges (from_object_id, created_at);

CREATE INDEX IF NOT EXISTS carboti_lineage_edges_to_idx
  ON carboti_lineage_edges (to_object_id, created_at);

CREATE TABLE IF NOT EXISTS carboti_webhook_endpoints (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL,
  secret_ref TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_webhook_endpoints_workspace_status_idx
  ON carboti_webhook_endpoints (workspace_id, status);

CREATE TABLE IF NOT EXISTS carboti_webhook_deliveries (
  id TEXT PRIMARY KEY,
  endpoint_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  response_status INTEGER,
  error_message TEXT,
  next_attempt_at TEXT,
  delivered_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_webhook_deliveries_endpoint_created_idx
  ON carboti_webhook_deliveries (endpoint_id, created_at);

CREATE TABLE IF NOT EXISTS carboti_api_clients (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  scopes_json TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS carboti_api_clients_workspace_status_idx
  ON carboti_api_clients (workspace_id, status);
