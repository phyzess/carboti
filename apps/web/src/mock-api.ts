import { handleMockAuthRoute } from "./mock-api-auth-routes";
import { handleMockImportRoute } from "./mock-api-import-routes";
import { handleMockInvitationRoute } from "./mock-api-invitation-routes";
import type { MockRouteContext } from "./mock-api-route-context";
import { handleMockWorkspaceRoute } from "./mock-api-workspace-routes";
import { readState, requestError, type RequestOptions } from "./mock-api-support";

export async function handleMockApiRequest<T>(
  requestUrl: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = new URL(requestUrl, window.location.origin);
  const context: MockRouteContext = {
    method: (options.method ?? "GET").toUpperCase(),
    options,
    segments: url.pathname.split("/").filter(Boolean),
    state: readState(),
    url,
  };

  const result =
    (await handleMockAuthRoute(context)) ??
    (await handleMockInvitationRoute(context)) ??
    (await handleMockWorkspaceRoute(context)) ??
    (await handleMockImportRoute(context));

  if (result !== undefined) {
    return result as T;
  }

  throw requestError(
    404,
    "mock_route_not_found",
    `No mock route for ${context.method} ${context.url.pathname}.`,
  );
}
