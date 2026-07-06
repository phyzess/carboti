import type { User } from "@carboti/auth";

export type UserRow = {
  id: string;
  email: string;
  role: string;
  display_name: string | null;
  created_at: string;
};

export type InvitationRow = {
  id: string;
  email: string;
  role: string;
  status: string;
  token_hash: string;
  expires_at: string;
  created_by: string;
  created_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  latest_email_error_message?: string | null;
  latest_email_message_id?: string | null;
  latest_email_provider_message_id?: string | null;
  latest_email_status?: string | null;
};

export type LoginRow = UserRow & {
  password_hash: string;
};

export type SessionUserRow = UserRow & {
  session_id: string;
  session_expires_at: string;
  session_absolute_expires_at: string;
};

export type CurrentUser = {
  user: User;
  sessionId: string;
  expiresAt: string;
};

export type PasswordResetTokenRow = {
  id: string;
  user_id: string;
  email: string;
  token_hash: string;
  status: string;
  expires_at: string;
  created_at: string;
  used_at: string | null;
  revoked_at: string | null;
};
