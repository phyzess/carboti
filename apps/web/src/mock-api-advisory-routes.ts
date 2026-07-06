import {
  confirmAdvisoryForState,
  dismissAdvisoryForState,
  generateAdvisoryForState,
  requireJob,
  respond,
} from "./mock-api-support";
import type { MockRouteContext, MockRouteResponse } from "./mock-api-route-context";

export function handleMockAdvisoryRoute(
  context: MockRouteContext,
  jobId: string,
): MockRouteResponse {
  const { method, segments, state } = context;

  if (method === "GET" && segments.length === 4) {
    requireJob(state, jobId);
    return respond({
      advisories: state.advisoriesByJobId[jobId] ?? [],
    });
  }

  if (method === "POST" && segments.length === 4) {
    return respond(generateAdvisoryForState(state, jobId));
  }

  if (method !== "POST" || segments.length !== 6) {
    return undefined;
  }

  const action = segments[5];
  if (action === "confirm") {
    return respond({ advisory: confirmAdvisoryForState(state, jobId, segments[4]) });
  }

  if (action === "dismiss") {
    return respond({ advisory: dismissAdvisoryForState(state, jobId, segments[4]) });
  }

  return undefined;
}
