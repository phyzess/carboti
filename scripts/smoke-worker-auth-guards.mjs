export function assertWorkerAuthGuards(context) {
  const { assert, workerAuthSession, workerEmailDelivery, workerSources } = context;

  assert(
    workerSources.includes("/api/bootstrap/invitations") &&
      workerSources.includes("/api/bootstrap/local-reviewer") &&
      workerSources.includes("/api/bootstrap/local-admin") &&
      workerSources.includes("auth.local_reviewer_bootstrapped") &&
      workerSources.includes("auth.local_admin_bootstrapped") &&
      workerSources.includes("bootstrap_disabled") &&
      workerSources.includes("returnToken: isLocalRuntime(context)"),
    "invitation creation and demo user bootstraps must stay local-only and separate from authenticated invitation creation.",
  );
  assert(
    workerSources.includes("requirePermission(context") &&
      workerSources.includes('action: "rbac.denied"') &&
      workerSources.includes("prepareSecurityEventInsert") &&
      workerSources.includes('"invitation:create"') &&
      workerSources.includes('"source_file:upload"') &&
      workerSources.includes('"review:decide"') &&
      workerSources.includes('"import_job:commit"') &&
      workerSources.includes('"ai_advisory:write"'),
    "worker write routes must enforce RBAC permissions and audit denials.",
  );
  assert(
    workerSources.includes("prepareLoginAttemptInsert") &&
      workerSources.includes("auth.login_failed") &&
      workerSources.includes("auth.login_succeeded"),
    "auth routes must record login attempts without storing raw credentials.",
  );
  assert(
    workerAuthSession.includes('export { readCurrentUser } from "./auth-session-current-user"') &&
      workerAuthSession.includes(
        'export { sessionCookieName, writeSessionCookie } from "./auth-session-cookie"',
      ) &&
      workerAuthSession.includes(
        'export { prepareSessionInsert } from "./auth-session-statements"',
      ) &&
      workerAuthSession.includes('sessionCookieName = "carboti_session"') &&
      workerAuthSession.includes("const token = getCookie(context, sessionCookieName)") &&
      workerAuthSession.includes("UPDATE sessions SET revoked_at = ? WHERE id = ?") &&
      workerAuthSession.includes("UPDATE sessions SET last_seen_at = ? WHERE id = ?"),
    "auth-session.ts must stay a facade over cookie policy, session inserts, and current-user session maintenance.",
  );
  assert(
    workerSources.includes("/api/auth/password-reset/request") &&
      workerSources.includes("/api/auth/password-reset/confirm") &&
      workerSources.includes("auth.password_reset_requested") &&
      workerSources.includes("auth.password_reset_succeeded") &&
      workerSources.includes("UPDATE sessions SET revoked_at"),
    "worker must expose self-service password reset and revoke sessions after reset.",
  );
  assert(
    workerSources.includes("deliverEmail") &&
      workerSources.includes("localeFromRequest") &&
      workerEmailDelivery.includes("email_messages") &&
      workerEmailDelivery.includes("emailDeliveryMode") &&
      workerEmailDelivery.includes("EMAIL_DELIVERY_MODE=send") &&
      workerEmailDelivery.includes("env.EMAIL.send") &&
      workerSources.includes("renderInvitationEmail") &&
      workerSources.includes("renderPasswordResetEmail"),
    "worker must deliver invitation and password reset emails through the email package.",
  );
  assert(
    workerSources.includes("/api/invitations/:invitationId/resend") &&
      workerSources.includes("/api/invitations/:invitationId/revoke") &&
      workerSources.includes('app.delete("/api/invitations/:invitationId"') &&
      workerSources.includes('app.delete("/api/users/:userId"') &&
      workerSources.includes("cannot_delete_self") &&
      workerSources.includes("last_admin_member") &&
      workerSources.includes("user.deleted"),
    "worker must expose complete invitation lifecycle and guarded member hard delete routes.",
  );
}
