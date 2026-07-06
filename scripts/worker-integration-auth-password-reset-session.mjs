import { assert, expectStatus } from "./worker-integration-http.mjs";

const jsonHeaders = {
  "content-type": "application/json",
};

export async function confirmResetAndLoginWithNewPassword({
  account,
  client,
  resetToken,
  resetPassword,
}) {
  await client.json("/api/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({
      token: resetToken,
      password: resetPassword,
    }),
    headers: jsonHeaders,
  });

  const sessionAfterReset = await client.json("/api/auth/me");
  assert(sessionAfterReset.user === null, "password reset revokes the active session");

  await expectStatus(
    await client.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: account.email,
        password: account.initialPassword,
      }),
      headers: jsonHeaders,
    }),
    401,
  );

  const loginAfterReset = await client.json("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: account.email,
      password: resetPassword,
    }),
    headers: jsonHeaders,
  });

  assert(loginAfterReset.user.email === account.email, "new password logs in");

  return { loginAfterReset };
}
