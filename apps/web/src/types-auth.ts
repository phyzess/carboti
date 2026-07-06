export type ApiUser = {
  id: string;
  email: string;
  role: string;
  displayName?: string;
  createdAt: string;
};

export type InvitationSummary = {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  createdBy?: string;
  acceptedAt?: string | null;
  latestEmailErrorMessage?: string | null;
  latestEmailMessageId?: string | null;
  latestEmailProviderMessageId?: string | null;
  latestEmailStatus?: string | null;
  revokedAt?: string | null;
};

export type EmailDeliverySummary = {
  emailMessageId: string;
  errorMessage?: string;
  mode: string;
  provider: string;
  providerMessageId?: string;
  sentAt?: string;
  status: string;
};
