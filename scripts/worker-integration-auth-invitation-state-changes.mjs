import { assert, expectStatus } from "./worker-integration-http.mjs";
import { assertAuditEvent } from "./worker-integration-audit-assertions.mjs";

export async function testManagedInvitationStateChanges({ adminClient, env, managedInvitation }) {
  const invitationId = managedInvitation.invitation.id;
  const resentManagedInvitation = await adminClient.json(
    `/api/invitations/${invitationId}/resend`,
    {
      method: "POST",
    },
  );
  assert(
    resentManagedInvitation.delivery === "stored" &&
      typeof resentManagedInvitation.inviteToken === "string",
    "admin can resend pending invitation and receive a local token",
  );
  await assertAuditEvent(env, {
    action: "invitation.resent",
    message: "resend is audited",
    subjectId: invitationId,
  });

  const revokedManagedInvitation = await adminClient.json(
    `/api/invitations/${invitationId}/revoke`,
    {
      method: "POST",
    },
  );
  assert(
    revokedManagedInvitation.invitation.status === "revoked",
    "admin can revoke pending invitation",
  );
  assert(
    typeof revokedManagedInvitation.invitation.revokedAt === "string",
    "revoked invitation returns revoked timestamp",
  );
  const invitationsAfterRevoke = await adminClient.json("/api/invitations?limit=20");
  assert(
    invitationsAfterRevoke.invitations.some(
      (invitation) => invitation.id === invitationId && invitation.status === "revoked",
    ),
    "revoked invitation is visible in invitation list",
  );
  await assertAuditEvent(env, {
    action: "invitation.revoked",
    message: "revoke is audited",
    subjectId: invitationId,
  });
  await expectStatus(
    await adminClient.request(`/api/invitations/${invitationId}/revoke`, {
      method: "POST",
    }),
    409,
  );
  const deletedRevokedInvitation = await adminClient.json(`/api/invitations/${invitationId}`, {
    method: "DELETE",
  });
  assert(
    deletedRevokedInvitation.deletedInvitationId === invitationId,
    "admin can delete revoked invitation",
  );
  await assertAuditEvent(env, {
    action: "invitation.deleted",
    message: "deleted invitation is audited",
    subjectId: invitationId,
  });
}
