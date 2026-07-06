import { createAuditEvent } from "@carboti/audit";
import type { Permission } from "@carboti/rbac";
import { prepareAuditInsert } from "./audit-store";
import { prepareSecurityEventInsert, requestFingerprint } from "./event-store";
import { authError, type AppContext } from "./http-utils";
import { appCan, normalizeAppRole } from "./rbac-policy";
import type { CurrentUser } from "./auth-types";

export async function requirePermission(
  context: AppContext,
  current: CurrentUser,
  permission: Permission,
): Promise<Response | null> {
  const role = normalizeAppRole(current.user.role);
  if (
    appCan(
      {
        id: current.user.id,
        role,
      },
      permission,
    )
  ) {
    return null;
  }

  const fingerprint = await requestFingerprint(context);
  await context.env.DB.batch([
    prepareAuditInsert(
      context.env,
      createAuditEvent({
        action: "rbac.denied",
        actor: {
          id: current.user.id,
          kind: "user",
        },
        subject: {
          id: permission,
          kind: "permission",
        },
        metadata: {
          method: context.req.method,
          path: context.req.path,
          role,
        },
      }),
    ),
    prepareSecurityEventInsert(context.env, {
      ...fingerprint,
      eventType: "rbac.denied",
      severity: "warning",
      actorUserId: current.user.id,
      targetUserId: current.user.id,
      action: permission,
      outcome: "denied",
      sessionId: current.sessionId,
      metadata: {
        method: context.req.method,
        path: context.req.path,
        role,
      },
    }),
  ]);

  return authError(context, "forbidden", "This user does not have permission.", 403);
}
