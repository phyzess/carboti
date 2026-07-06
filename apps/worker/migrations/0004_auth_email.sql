CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  used_at TEXT,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_user_status_idx
  ON password_reset_tokens (user_id, status);

CREATE INDEX IF NOT EXISTS password_reset_tokens_email_status_idx
  ON password_reset_tokens (email, status);

CREATE INDEX IF NOT EXISTS password_reset_tokens_token_hash_idx
  ON password_reset_tokens (token_hash);

CREATE TABLE IF NOT EXISTS email_messages (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_message_id TEXT,
  error_message TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  sent_at TEXT
);

CREATE INDEX IF NOT EXISTS email_messages_recipient_status_idx
  ON email_messages (recipient_email, status);

CREATE INDEX IF NOT EXISTS email_messages_kind_status_idx
  ON email_messages (kind, status);
