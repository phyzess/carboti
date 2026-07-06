ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'viewer';

CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);
