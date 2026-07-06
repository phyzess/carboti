import { createAuditEvent } from "@carboti/audit";
import { prepareAuditInsert } from "./audit-store";
import type { CurrentUser, UserRow } from "./auth-types";
import { hashEventValue, prepareSecurityEventInsert, requestFingerprint } from "./event-store";
import type { AppContext } from "./http-utils";
import type { AppRoleName } from "./rbac-policy";

export async function deleteUserRecord(input: {
  context: AppContext;
  current: CurrentUser;
  role: AppRoleName;
  user: UserRow;
}): Promise<void> {
  const { context, current, role, user } = input;
  const now = new Date().toISOString();
  const fingerprint = await requestFingerprint(context);
  const emailHash = (await hashEventValue(user.email)) ?? user.email;

  await context.env.DB.batch([
    context.env.DB.prepare("DELETE FROM password_credentials WHERE user_id = ?").bind(user.id),
    context.env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id),
    context.env.DB.prepare("DELETE FROM password_reset_tokens WHERE user_id = ?").bind(user.id),
    context.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(user.id),
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "user.deleted",
        actor: {
          id: current.user.id,
          kind: "user",
        },
        subject: {
          id: user.id,
          kind: "user",
        },
        metadata: {
          deletedBy: current.user.id,
          emailHash,
          role,
        },
      }),
    ),
    prepareSecurityEventInsert(context.env, {
      ...fingerprint,
      eventType: "user.deleted",
      severity: "warning",
      actorUserId: current.user.id,
      targetUserId: user.id,
      action: "user.delete",
      outcome: "succeeded",
      sessionId: current.sessionId,
      createdAt: now,
      metadata: {
        deletedBy: current.user.id,
        emailHash,
        role,
      },
    }),
  ]);
}
