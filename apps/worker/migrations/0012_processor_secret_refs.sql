CREATE TABLE IF NOT EXISTS carboti_secret_refs (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  key_version TEXT NOT NULL,
  iv TEXT NOT NULL,
  ciphertext TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS carboti_secret_refs_workspace_kind_idx
  ON carboti_secret_refs (workspace_id, kind, created_at);
