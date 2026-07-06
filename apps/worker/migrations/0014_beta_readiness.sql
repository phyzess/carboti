ALTER TABLE carboti_secret_refs ADD COLUMN name TEXT;
ALTER TABLE carboti_secret_refs ADD COLUMN description TEXT;
ALTER TABLE carboti_secret_refs ADD COLUMN status TEXT;

CREATE INDEX IF NOT EXISTS carboti_secret_refs_workspace_status_idx
  ON carboti_secret_refs (workspace_id, status, created_at);
