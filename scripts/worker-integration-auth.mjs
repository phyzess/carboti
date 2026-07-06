import { expectStatus } from "./worker-integration-http.mjs";
import {
  testBootstrapAccessAndEmailDelivery,
  testLocalBootstrapAccounts,
} from "./worker-integration-auth-bootstrap.mjs";
import { testInvitationRolesAndMemberAdministration } from "./worker-integration-auth-members.mjs";
import { testReviewerInvitationPasswordReset } from "./worker-integration-auth-password-reset.mjs";

export async function testAuthBootstrapAndMembers({ client, env, worker }) {
  await expectStatus(await client.post("/api/source-files", "unauthorized"), 401);

  await testBootstrapAccessAndEmailDelivery({ worker });
  await testInvitationRolesAndMemberAdministration({ env, worker });
  await testLocalBootstrapAccounts({ env, worker });

  return await testReviewerInvitationPasswordReset({ client, env });
}
