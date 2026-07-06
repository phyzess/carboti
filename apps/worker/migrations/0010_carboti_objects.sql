CREATE TABLE IF NOT EXISTS carboti_objects (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  source_id TEXT,
  message_id TEXT,
  object_key TEXT,
  content_type TEXT,
  content_hash TEXT,
  size INTEGER,
  data_json TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_objects_workspace_kind_idx
  ON carboti_objects (workspace_id, kind, created_at);

CREATE INDEX IF NOT EXISTS carboti_objects_message_kind_idx
  ON carboti_objects (message_id, kind, created_at);

CREATE INDEX IF NOT EXISTS carboti_objects_object_key_idx
  ON carboti_objects (object_key);
