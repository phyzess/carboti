import { createTestEnv } from "./worker-integration-env.mjs";
import { assertEmailMessage } from "./worker-integration-email-assertions.mjs";
import { FakeEmailSender } from "./worker-integration-fake-email.mjs";
import { assert, createClient } from "./worker-integration-http.mjs";

export async function testFailedInvitationEmailDelivery({ worker }) {
  const failingEmailEnv = await createTestEnv({
    EMAIL: new FakeEmailSender({ fail: true }),
    EMAIL_DELIVERY_MODE: "send",
    MAIL_FROM: "noreply@phyzess.me",
  });
  const failingEmailAdmin = createClient(worker, failingEmailEnv);
  await failingEmailAdmin.json("/api/bootstrap/local-admin", {
    method: "POST",
    body: JSON.stringify({
      email: "failing-email-admin@example.com",
      password: "correct horse battery staple",
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  const failedInviteDelivery = await failingEmailAdmin.json("/api/invitations", {
    method: "POST",
    body: JSON.stringify({
      email: "failed-delivery@example.com",
      role: "viewer",
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  assert(
    failedInviteDelivery.invitation.status === "pending" &&
      failedInviteDelivery.delivery === "failed" &&
      failedInviteDelivery.emailDelivery.errorMessage.includes("Simulated email failure"),
    "invitation is created and marks failed email delivery",
  );
  await assertEmailMessage(failingEmailEnv, {
    errorIncludes: "Simulated email failure",
    kind: "invitation",
    message: "failed invitation email is recorded in email_messages",
    status: "failed",
  });
}
