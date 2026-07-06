import { testManagedInvitationStateChanges } from "./worker-integration-auth-invitation-state-changes.mjs";
import { createManagedViewerInvitation } from "./worker-integration-auth-managed-invitation.mjs";

export async function testAdminInvitationLifecycle({ adminClient, env }) {
  const managedInvitation = await createManagedViewerInvitation({ adminClient });

  await testManagedInvitationStateChanges({ adminClient, env, managedInvitation });
}
