import {
  deleteUserForState,
  filterAuditEvents,
  limited,
  requireUser,
  respond,
  uploadSourceFileForState,
} from "./mock-api-support";
import type { MockRouteContext, MockRouteResult } from "./mock-api-route-context";

export async function handleMockWorkspaceRoute(context: MockRouteContext): MockRouteResult {
  const { method, options, segments, state, url } = context;

  if (method === "GET" && url.pathname === "/api/users") {
    requireUser(state);
    return respond({
      users: limited(state.users, url),
    });
  }

  if (method === "DELETE" && segments[0] === "api" && segments[1] === "users" && segments[2]) {
    return respond(deleteUserForState(state, segments[2]));
  }

  if (method === "GET" && url.pathname === "/api/source-files") {
    requireUser(state);
    return respond({
      sourceFiles: limited(state.sourceFiles, url),
    });
  }

  if (method === "POST" && url.pathname === "/api/source-files") {
    return respond(await uploadSourceFileForState(state, options));
  }

  if (method === "GET" && url.pathname === "/api/audit-events") {
    requireUser(state);
    return respond({
      auditEvents: limited(filterAuditEvents(state.auditEvents, url), url),
    });
  }

  return undefined;
}
