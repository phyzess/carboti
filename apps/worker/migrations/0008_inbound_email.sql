CREATE TABLE IF NOT EXISTS inbound_email_messages (
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
);

CREATE INDEX IF NOT EXISTS inbound_email_messages_received_idx
  ON inbound_email_messages(received_at);

CREATE TABLE IF NOT EXISTS inbound_email_attachments (
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
);

CREATE INDEX IF NOT EXISTS inbound_email_attachments_email_idx
  ON inbound_email_attachments(inbound_email_id, created_at);

CREATE INDEX IF NOT EXISTS inbound_email_attachments_source_idx
  ON inbound_email_attachments(source_file_id);
