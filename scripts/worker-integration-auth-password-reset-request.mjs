import { assertEmailMessage } from "./worker-integration-email-assertions.mjs";
import { assert } from "./worker-integration-http.mjs";

const jsonHeaders = {
  "content-type": "application/json",
};

export async function requestStoredPasswordReset({ account, client, env }) {
  const reset = await client.json("/api/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({
      email: account.email,
    }),
    headers: jsonHeaders,
  });

  assert(typeof reset.resetToken === "string", "local password reset returns reset token");
  assert(reset.delivery === "stored", "password reset stores local email");

  await assertEmailMessage(env, {
    kind: "password_reset",
    message: "password reset email metadata is persisted",
    status: "stored",
  });

  return reset;
}
