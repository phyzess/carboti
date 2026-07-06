import { CreateInvitationInputSchema } from "@carboti/auth";
import type { Hono } from "hono";
import {
  createInvitationResponse,
  createLocalUserBootstrapResponse,
  isLocalRuntime,
} from "./auth-route-support";
import { authError, parseRequestJson } from "./http-utils";
import { localeFromRequest } from "./locale";

export function registerAuthBootstrapRoutes(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/bootstrap/invitations", async (context) => {
    if (!isLocalRuntime(context)) {
      return authError(context, "bootstrap_disabled", "Bootstrap invitations are local-only.", 403);
    }

    const input = await parseRequestJson(context, CreateInvitationInputSchema);
    if (!input.ok) return input.response;
    const locale = localeFromRequest(context, input.body);

    return createInvitationResponse(context, input.value, {
      createdBy: "system",
      locale,
      returnToken: true,
    });
  });

  app.post("/api/bootstrap/local-reviewer", async (context) => {
    return createLocalUserBootstrapResponse(context, {
      action: "auth.local_reviewer_bootstrap",
      defaultDisplayName: "Operator",
      eventType: "auth.local_reviewer_bootstrapped",
      role: "reviewer",
    });
  });

  app.post("/api/bootstrap/local-admin", async (context) => {
    return createLocalUserBootstrapResponse(context, {
      action: "auth.local_admin_bootstrap",
      defaultDisplayName: "Admin",
      eventType: "auth.local_admin_bootstrapped",
      role: "admin",
    });
  });
}
