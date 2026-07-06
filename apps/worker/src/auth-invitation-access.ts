import { requirePermission } from "./auth-permissions";
import { readCurrentUser } from "./auth-session";
import type { CurrentUser } from "./auth-types";
import { authError, type AppContext } from "./http-utils";

type InvitationManagerResult =
  | {
      ok: true;
      current: CurrentUser;
    }
  | {
      ok: false;
      response: Response;
    };

export async function requireInvitationManager(
  context: AppContext,
): Promise<InvitationManagerResult> {
  const current = await readCurrentUser(context);
  if (!current) {
    return {
      ok: false,
      response: authError(context, "unauthorized", "Login is required.", 401),
    };
  }

  const denied = await requirePermission(context, current, "invitation:create");
  if (denied) {
    return {
      ok: false,
      response: denied,
    };
  }

  return {
    ok: true,
    current,
  };
}
