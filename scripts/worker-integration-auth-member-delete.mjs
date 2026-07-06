import { assert, createClient, expectStatus } from "./worker-integration-http.mjs";
import { assertAuditEvent } from "./worker-integration-audit-assertions.mjs";
import { createAcceptedAuthenticatedUser } from "./worker-integration-auth-invitation-flow.mjs";

export async function testAdminMemberHardDelete({ adminAccepted, adminClient, env, worker }) {
  const deleteMemberClient = createClient(worker, env);
  const { accepted: deleteMemberAccepted } = await createAcceptedAuthenticatedUser({
    adminClient,
    displayName: "Delete Member",
    email: "delete-member@example.com",
    memberClient: deleteMemberClient,
    role: "viewer",
  });
  await deleteMemberClient.json("/api/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({
      email: "delete-member@example.com",
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  await expectStatus(
    await adminClient.request(`/api/users/${adminAccepted.user.id}`, {
      method: "DELETE",
    }),
    409,
  );
  const deletedMember = await adminClient.json(`/api/users/${deleteMemberAccepted.user.id}`, {
    method: "DELETE",
  });
  assert(deletedMember.ok === true, "admin can hard-delete a member");
  assert(
    !(await env.DB.prepare("SELECT id FROM users WHERE id = ? LIMIT 1")
      .bind(deleteMemberAccepted.user.id)
      .first()),
    "hard delete removes user row",
  );
  assert(
    !(await env.DB.prepare("SELECT user_id FROM password_credentials WHERE user_id = ? LIMIT 1")
      .bind(deleteMemberAccepted.user.id)
      .first()),
    "hard delete removes password credentials",
  );
  assert(
    !(await env.DB.prepare("SELECT id FROM sessions WHERE user_id = ? LIMIT 1")
      .bind(deleteMemberAccepted.user.id)
      .first()),
    "hard delete removes sessions",
  );
  assert(
    !(await env.DB.prepare("SELECT id FROM password_reset_tokens WHERE user_id = ? LIMIT 1")
      .bind(deleteMemberAccepted.user.id)
      .first()),
    "hard delete removes password reset tokens",
  );
  await assertAuditEvent(env, {
    action: "user.deleted",
    message: "delete is audited",
    subjectId: deleteMemberAccepted.user.id,
  });
}
