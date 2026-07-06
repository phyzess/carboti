import { testAdminInvitationLifecycle } from "./worker-integration-auth-invitation-admin.mjs";
import { testAdminMemberHardDelete } from "./worker-integration-auth-member-delete.mjs";
import { testInvitationAssignedRolesAndViewerDenials } from "./worker-integration-auth-member-roles.mjs";

export async function testInvitationRolesAndMemberAdministration({ env, worker }) {
  const { adminAccepted, adminClient } = await testInvitationAssignedRolesAndViewerDenials({
    env,
    worker,
  });

  await testAdminInvitationLifecycle({ adminClient, env });
  await testAdminMemberHardDelete({ adminAccepted, adminClient, env, worker });
}
