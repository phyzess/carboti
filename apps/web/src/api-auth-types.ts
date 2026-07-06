import type { ApiUser, EmailDeliverySummary, InvitationSummary } from "./types";

export type MeResponse = {
  user: ApiUser | null;
  session?: {
    id: string;
    expiresAt: string;
  };
};

export type LoginResponse = {
  user: ApiUser;
  session: {
    id: string;
    expiresAt: string;
  };
};

export type LocalUserBootstrapResponse = LoginResponse & {
  created: boolean;
};

export type HealthResponse = {
  ok: true;
  service: string;
  environment: string;
};

export type BootstrapInvitationResponse = {
  delivery: string;
  emailDelivery?: EmailDeliverySummary;
  inviteToken: string;
  inviteUrl: string;
  invitation: InvitationSummary;
};

export type CreateInvitationResponse = {
  delivery: string;
  emailDelivery?: EmailDeliverySummary;
  inviteToken?: string;
  inviteUrl?: string;
  invitation: InvitationSummary;
};

export type ResendInvitationResponse = CreateInvitationResponse;

export type RevokeInvitationResponse = {
  invitation: InvitationSummary;
};

export type DeleteInvitationResponse = {
  deletedInvitationId: string;
  ok: true;
};

export type UsersResponse = {
  users: ApiUser[];
};

export type InvitationsResponse = {
  invitations: InvitationSummary[];
};

export type RequestPasswordResetResponse = {
  ok: true;
  delivery?: string;
  emailDelivery?: EmailDeliverySummary;
  resetToken?: string;
  resetUrl?: string;
};

export type DeleteUserResponse = {
  deletedUserId: string;
  ok: true;
};
