import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    role: text("role").notNull(),
    displayName: text("display_name"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("users_role_idx").on(table.role)],
);

export const invitations = sqliteTable("invitations", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull(),
  acceptedAt: text("accepted_at"),
  revokedAt: text("revoked_at"),
});

export const passwordCredentials = sqliteTable("password_credentials", {
  userId: text("user_id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    expiresAt: text("expires_at").notNull(),
    absoluteExpiresAt: text("absolute_expires_at").notNull(),
    createdAt: text("created_at").notNull(),
    lastSeenAt: text("last_seen_at").notNull(),
    revokedAt: text("revoked_at"),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const passwordResetTokens = sqliteTable(
  "password_reset_tokens",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    email: text("email").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    status: text("status").notNull(),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at").notNull(),
    usedAt: text("used_at"),
    revokedAt: text("revoked_at"),
  },
  (table) => [
    index("password_reset_tokens_user_status_idx").on(table.userId, table.status),
    index("password_reset_tokens_email_status_idx").on(table.email, table.status),
    index("password_reset_tokens_token_hash_idx").on(table.tokenHash),
  ],
);

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: text("id").primaryKey(),
    emailHash: text("email_hash").notNull(),
    userId: text("user_id"),
    outcome: text("outcome").notNull(),
    failureReason: text("failure_reason"),
    ipHash: text("ip_hash"),
    userAgentHash: text("user_agent_hash"),
    requestId: text("request_id"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("login_attempts_email_created_idx").on(table.emailHash, table.createdAt),
    index("login_attempts_user_created_idx").on(table.userId, table.createdAt),
  ],
);
