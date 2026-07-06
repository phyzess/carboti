import {
  createAbsoluteSessionExpiry,
  createInviteExpiry,
  createPasswordResetExpiry,
  createRollingSessionExpiry,
} from "./expiry";
import { normalizeEmail } from "./identity";
import type { Invitation, PasswordResetToken, Session } from "./schemas";
import { generateToken, hashSecret } from "./tokens";

export type InvitationWithToken = {
  invitation: Invitation;
  token: string;
};

export type SessionWithToken = {
  session: Session;
  token: string;
};

export type PasswordResetWithToken = {
  passwordResetToken: PasswordResetToken;
  token: string;
};

export async function createInvitation(input: {
  email: string;
  role: string;
  createdBy: string;
  now?: Date;
  expiresAt?: string;
}): Promise<InvitationWithToken> {
  const now = input.now ?? new Date();
  const token = generateToken();
  const invitation: Invitation = {
    id: crypto.randomUUID(),
    email: normalizeEmail(input.email),
    role: input.role,
    status: "pending",
    tokenHash: await hashSecret(token),
    expiresAt: input.expiresAt ?? createInviteExpiry(now),
    createdBy: input.createdBy,
    createdAt: now.toISOString(),
  };

  return {
    invitation,
    token,
  };
}

export async function createSession(input: {
  userId: string;
  now?: Date;
}): Promise<SessionWithToken> {
  const now = input.now ?? new Date();
  const token = generateToken();
  const session: Session = {
    id: crypto.randomUUID(),
    userId: input.userId,
    tokenHash: await hashSecret(token),
    expiresAt: createRollingSessionExpiry(now),
    absoluteExpiresAt: createAbsoluteSessionExpiry(now),
    createdAt: now.toISOString(),
    lastSeenAt: now.toISOString(),
  };

  return {
    session,
    token,
  };
}

export async function createPasswordResetToken(input: {
  userId: string;
  email: string;
  now?: Date;
  expiresAt?: string;
}): Promise<PasswordResetWithToken> {
  const now = input.now ?? new Date();
  const token = generateToken();
  const passwordResetToken: PasswordResetToken = {
    id: crypto.randomUUID(),
    userId: input.userId,
    email: normalizeEmail(input.email),
    tokenHash: await hashSecret(token),
    status: "pending",
    expiresAt: input.expiresAt ?? createPasswordResetExpiry(now),
    createdAt: now.toISOString(),
  };

  return {
    passwordResetToken,
    token,
  };
}
