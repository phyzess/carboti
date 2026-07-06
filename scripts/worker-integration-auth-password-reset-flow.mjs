import { requestStoredPasswordReset } from "./worker-integration-auth-password-reset-request.mjs";
import { confirmResetAndLoginWithNewPassword } from "./worker-integration-auth-password-reset-session.mjs";

const REVIEWER_RESET_PASSWORD = "reset horse battery staple";

export async function resetReviewerPasswordAndLogin({ account, client, env }) {
  const reset = await requestStoredPasswordReset({
    account,
    client,
    env,
  });

  return confirmResetAndLoginWithNewPassword({
    account,
    client,
    resetPassword: REVIEWER_RESET_PASSWORD,
    resetToken: reset.resetToken,
  });
}
