import { assert } from "./worker-integration-http.mjs";
import { createAuthenticatedInvitation } from "./worker-integration-auth-invitation-flow.mjs";

const MANAGED_VIEWER_EMAIL = "managed-viewer@example.com";

export async function createManagedViewerInvitation({ adminClient }) {
  const managedInvitation = await createAuthenticatedInvitation({
    client: adminClient,
    email: MANAGED_VIEWER_EMAIL,
    role: "viewer",
  });
  assert(
    typeof managedInvitation.inviteToken === "string",
    "local authenticated invitation returns token",
  );
  assert(managedInvitation.emailDelivery.status === "stored", "invite returns email delivery");

  const managedUsers = await adminClient.json("/api/users?limit=20");
  assert(
    managedUsers.users.some((user) => user.email === "admin@example.com"),
    "admin can list users",
  );
  const managedInvitations = await adminClient.json("/api/invitations?limit=20");
  assert(
    managedInvitations.invitations.some((invitation) => invitation.email === MANAGED_VIEWER_EMAIL),
    "admin can list invitations",
  );
  assert(
    managedInvitations.invitations.some(
      (invitation) =>
        invitation.email === MANAGED_VIEWER_EMAIL && invitation.latestEmailStatus === "stored",
    ),
    "invitation list includes latest email delivery status",
  );

  return managedInvitation;
}
