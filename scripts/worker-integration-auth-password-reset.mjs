import { resetReviewerPasswordAndLogin } from "./worker-integration-auth-password-reset-flow.mjs";
import { createReviewerAccountAndLogin } from "./worker-integration-auth-reviewer-account.mjs";

export async function testReviewerInvitationPasswordReset({ client, env }) {
  const account = await createReviewerAccountAndLogin({ client });

  return resetReviewerPasswordAndLogin({ account, client, env });
}
