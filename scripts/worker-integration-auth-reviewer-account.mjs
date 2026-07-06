import { assert } from "./worker-integration-http.mjs";
import {
  createAcceptedBootstrapUser,
  TEST_AUTH_PASSWORD,
} from "./worker-integration-auth-invitation-flow.mjs";

const REVIEWER_EMAIL = "reviewer@example.com";

export async function createReviewerAccountAndLogin({ client }) {
  const { accepted, invitation: bootstrap } = await createAcceptedBootstrapUser({
    client,
    displayName: "Operator",
    email: REVIEWER_EMAIL,
    role: "reviewer",
  });

  assert(typeof bootstrap.inviteToken === "string", "bootstrap returns invite token");
  assert(bootstrap.delivery === "stored", "bootstrap stores local invitation email");

  assert(accepted.user.email === REVIEWER_EMAIL, "invite accept creates reviewer");
  assert(accepted.user.role === "reviewer", "invite accept preserves reviewer role");

  await client.json("/api/auth/logout", {
    method: "POST",
  });

  const login = await client.json("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: REVIEWER_EMAIL,
      password: TEST_AUTH_PASSWORD,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  assert(login.user.email === REVIEWER_EMAIL, "login returns reviewer");
  assert(login.user.role === "reviewer", "login preserves reviewer role");

  return {
    email: REVIEWER_EMAIL,
    initialPassword: TEST_AUTH_PASSWORD,
  };
}
