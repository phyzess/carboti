import {
  AcceptInvitationInputSchema,
  createSession,
  hashPassword,
  hashSecret,
  isExpired,
  normalizeEmail,
  type User,
} from "@carboti/auth";
import type { Hono } from "hono";
import {
  markInvitationExpired,
  prepareInvitationAcceptStatements,
} from "./auth-invitation-accept-record";
import { readExistingInvitationUser } from "./auth-invitation-accept-target";
import { readInvitationByTokenHash } from "./auth-invitation-store";
import { publicSession } from "./auth-presenters";
import { writeSessionCookie } from "./auth-session";
import { authError, parseRequestJson } from "./http-utils";
import { normalizeAppRole } from "./rbac-policy";

export function registerAuthInvitationAcceptRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/invitations/:token/accept", async (context) => {
    const token = context.req.param("token");
    const input = await parseRequestJson(context, AcceptInvitationInputSchema);
    if (!input.ok) return input.response;

    const tokenHash = await hashSecret(token);
    const invitation = await readInvitationByTokenHash(context, tokenHash);

    if (!invitation) {
      return authError(context, "invalid_invitation", "Invitation is invalid or expired.", 404);
    }

    if (invitation.status !== "pending") {
      return authError(context, "invitation_not_pending", "Invitation is no longer pending.", 409);
    }

    if (isExpired(invitation.expires_at)) {
      await markInvitationExpired(context.env, invitation.id);

      return authError(context, "invitation_expired", "Invitation is invalid or expired.", 410);
    }

    const existingUser = await readExistingInvitationUser(context.env, invitation.email);

    if (existingUser) {
      return authError(context, "user_exists", "A user already exists for this invitation.", 409);
    }

    const now = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      email: normalizeEmail(invitation.email),
      role: normalizeAppRole(invitation.role),
      createdAt: now,
    };

    if (input.value.displayName) {
      user.displayName = input.value.displayName;
    }

    const passwordHash = await hashPassword(input.value.password);
    const { session, token: sessionToken } = await createSession({
      userId: user.id,
    });

    await context.env.DB.batch(
      prepareInvitationAcceptStatements(context.env, {
        invitation,
        now,
        passwordHash,
        session,
        user,
      }),
    );

    writeSessionCookie(context, sessionToken, session.expiresAt);

    return context.json(
      {
        user,
        session: publicSession(session),
      },
      201,
    );
  });
}
