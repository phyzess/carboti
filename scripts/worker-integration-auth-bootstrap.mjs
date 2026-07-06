import { testBootstrapDisabledOutsideLocal } from "./worker-integration-auth-bootstrap-access.mjs";
import { testFailedInvitationEmailDelivery } from "./worker-integration-auth-email-delivery.mjs";
export { testLocalBootstrapAccounts } from "./worker-integration-auth-local-bootstrap.mjs";

export async function testBootstrapAccessAndEmailDelivery({ worker }) {
  await testBootstrapDisabledOutsideLocal({ worker });
  await testFailedInvitationEmailDelivery({ worker });
}
