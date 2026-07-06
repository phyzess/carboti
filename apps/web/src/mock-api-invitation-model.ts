import type { InvitationSummary } from "./types";
import { shortId } from "./mock-api-identifiers";
import { hoursFrom, nowIso } from "./mock-api-time";

export type MockInvitation = InvitationSummary & {
  token: string;
};

export function invitation(
  id: string,
  email: string,
  role: string,
  status: string,
  token: string,
  createdAt: string,
): MockInvitation {
  return {
    acceptedAt: null,
    createdAt,
    createdBy: "demo-admin",
    email,
    expiresAt: hoursFrom(createdAt, 72),
    id,
    latestEmailErrorMessage: null,
    latestEmailMessageId: `email-${id}`,
    latestEmailProviderMessageId: `mock-${id}`,
    latestEmailStatus: "stored",
    revokedAt: null,
    role,
    status,
    token,
  };
}

export function invitationResponse(invitation: MockInvitation) {
  return {
    delivery: "mock",
    emailDelivery: mockEmailDelivery(invitation.latestEmailStatus ?? "stored"),
    invitation: publicInvitation(invitation),
    inviteToken: invitation.token,
    inviteUrl: new URL(`/invite/${invitation.token}`, window.location.origin).toString(),
  };
}

export function publicInvitation(invitation: MockInvitation): InvitationSummary {
  const { token: _token, ...publicShape } = invitation;
  return publicShape;
}

export function mockEmailDelivery(status: string) {
  return {
    emailMessageId: `email-${shortId()}`,
    mode: "mock",
    provider: "browser-local-state",
    providerMessageId: `mock-${shortId()}`,
    sentAt: nowIso(),
    status,
  };
}
