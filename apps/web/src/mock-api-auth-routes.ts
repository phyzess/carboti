import {
  bootstrapDemoUser,
  confirmDemoPasswordReset,
  currentDemoSession,
  loginDemoUser,
  logoutDemoUser,
  readJsonBody,
  requestDemoPasswordReset,
  respond,
} from "./mock-api-support";
import type { MockRouteContext, MockRouteResult } from "./mock-api-route-context";

export async function handleMockAuthRoute(context: MockRouteContext): MockRouteResult {
  const { method, options, state, url } = context;

  if (method === "GET" && url.pathname === "/health") {
    return respond({
      environment: "demo",
      ok: true,
      service: "carboti-worker",
    });
  }

  if (method === "GET" && url.pathname === "/api/auth/me") {
    return respond(currentDemoSession(state));
  }

  if (method === "POST" && url.pathname === "/api/auth/login") {
    return respond(loginDemoUser(state, await readJsonBody(options)));
  }

  if (method === "POST" && url.pathname === "/api/auth/logout") {
    return respond(logoutDemoUser(state));
  }

  if (method === "POST" && url.pathname === "/api/auth/password-reset/request") {
    return respond(requestDemoPasswordReset(state, await readJsonBody(options)));
  }

  if (method === "POST" && url.pathname === "/api/auth/password-reset/confirm") {
    return respond(confirmDemoPasswordReset(state));
  }

  if (method === "POST" && url.pathname === "/api/bootstrap/local-admin") {
    return respond(bootstrapDemoUser(state, await readJsonBody(options), "admin"));
  }

  if (method === "POST" && url.pathname === "/api/bootstrap/local-reviewer") {
    return respond(bootstrapDemoUser(state, await readJsonBody(options), "reviewer"));
  }

  return undefined;
}
