import { pushAudit } from "./mock-api-events";
import { requestError } from "./mock-api-http";
import { shortId } from "./mock-api-identifiers";
import { invitation, invitationResponse } from "./mock-api-invitation-model";
import { findOrCreateDemoUser, requireInvitation, requireUser } from "./mock-api-selectors";
import { writeState, type MockState } from "./mock-api-state";
import { nowIso, oneDayFromNow } from "./mock-api-time";
import { normalizedEmail } from "./mock-api-values";

export function createInvitationForState(
  state: MockState,
  input: { email?: string; role?: string },
) {
  const user = requireUser(state);
  const created = invitation(
    `demo-invitation-${shortId()}`,
    normalizedEmail(input.email) ?? "new-user@example.com",
    input.role ?? "viewer",
    "pending",
    `demo-invite-${shortId()}`,
    nowIso(),
  );
  created.createdBy = user.id;
  state.invitations = [created, ...state.invitations];
  pushAudit(
    state,
    "invitation.created",
    { id: created.id, kind: "invitation" },
    { delivery: "mock", email: created.email, role: created.role },
    user.id,
  );
  writeState(state);
  return invitationResponse(created);
}

export function revokeInvitationForState(state: MockState, invitationId: string | undefined) {
  const invitation = requireInvitation(state, invitationId);
  invitation.status = "revoked";
  invitation.revokedAt = nowIso();
  pushAudit(
    state,
    "invitation.revoked",
    { id: invitation.id, kind: "invitation" },
    { email: invitation.email },
  );
  writeState(state);
  return invitation;
}

export function resendInvitationForState(state: MockState, invitationId: string | undefined) {
  const invitation = requireInvitation(state, invitationId);
  invitation.latestEmailMessageId = `email-${shortId()}`;
  invitation.latestEmailProviderMessageId = `mock-${shortId()}`;
  invitation.latestEmailStatus = "stored";
  invitation.latestEmailErrorMessage = null;
  pushAudit(
    state,
    "invitation.email_requested",
    { id: invitation.id, kind: "invitation" },
    { delivery: "mock", email: invitation.email },
  );
  writeState(state);
  return invitationResponse(invitation);
}

export function deleteInvitationForState(state: MockState, invitationId: string | undefined) {
  const invitation = requireInvitation(state, invitationId);
  state.invitations = state.invitations.filter((item) => item.id !== invitation.id);
  pushAudit(
    state,
    "invitation.deleted",
    { id: invitation.id, kind: "invitation" },
    { email: invitation.email },
  );
  writeState(state);
  return invitation.id;
}

export function acceptInvitationForState(
  state: MockState,
  token: string | undefined,
  input: { displayName?: string },
) {
  const invitation = state.invitations.find((item) => item.token === token);
  if (!invitation) {
    throw requestError(404, "invitation_not_found", "Invitation was not found.");
  }

  const user = findOrCreateDemoUser(state, invitation.email, invitation.role, input.displayName);
  invitation.status = "accepted";
  invitation.acceptedAt = nowIso();
  state.currentUserId = user.id;
  pushAudit(
    state,
    "invitation.accepted",
    { id: invitation.id, kind: "invitation" },
    { email: invitation.email, userId: user.id },
  );
  writeState(state);
  return {
    session: {
      expiresAt: oneDayFromNow(),
      id: "demo-session",
    },
    user,
  };
}
