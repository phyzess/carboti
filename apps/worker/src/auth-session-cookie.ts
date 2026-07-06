import { setCookie } from "hono/cookie";
import type { AppContext } from "./http-utils";
import { runtimeConfig } from "./runtime";

export const sessionCookieName = "carboti_session";

export function writeSessionCookie(context: AppContext, token: string, expiresAt: string): void {
  const runtime = runtimeConfig(context.env);

  setCookie(context, sessionCookieName, token, {
    httpOnly: true,
    secure: runtime.APP_ENV !== "local",
    sameSite: "Lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}
