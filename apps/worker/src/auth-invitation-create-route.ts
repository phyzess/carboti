import { CreateInvitationInputSchema } from "@carboti/auth";
import type { Hono } from "hono";
import { requireInvitationManager } from "./auth-invitation-access";
import { createInvitationResponse, isLocalRuntime } from "./auth-route-support";
import { parseRequestJson } from "./http-utils";
import { localeFromRequest } from "./locale";

export function registerAuthInvitationCreateRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/invitations", async (context) => {
    const manager = await requireInvitationManager(context);
    if (!manager.ok) return manager.response;

    const input = await parseRequestJson(context, CreateInvitationInputSchema);
    if (!input.ok) return input.response;
    const locale = localeFromRequest(context, input.body);

    return createInvitationResponse(context, input.value, {
      createdBy: manager.current.user.id,
      locale,
      returnToken: isLocalRuntime(context),
    });
  });
}
