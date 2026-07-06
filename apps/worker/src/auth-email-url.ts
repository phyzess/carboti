import { authError, type AppContext } from "./http-utils";
import { PublicAppUrlConfigError, buildAppUrl } from "./runtime";

export function buildInvitationUrl(
  context: AppContext,
  token: string,
): { ok: true; url: string } | { ok: false; response: Response } {
  return buildPublicRouteUrl(context, `/invite/${token}`);
}

export function buildPasswordResetUrl(
  context: AppContext,
  token: string,
): { ok: true; url: string } | { ok: false; response: Response } {
  return buildPublicRouteUrl(context, `/reset-password/${token}`);
}

function buildPublicRouteUrl(
  context: AppContext,
  path: string,
): { ok: true; url: string } | { ok: false; response: Response } {
  try {
    return {
      ok: true,
      url: buildAppUrl(context.env, path),
    };
  } catch (error) {
    if (error instanceof PublicAppUrlConfigError) {
      return {
        ok: false,
        response: authError(context, "public_app_url_invalid", error.message, 500),
      };
    }

    throw error;
  }
}
