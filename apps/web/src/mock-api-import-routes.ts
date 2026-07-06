import { handleMockAdvisoryRoute } from "./mock-api-advisory-routes";
import { handleMockImportJobRoute } from "./mock-api-import-job-routes";
import { handleMockImportReviewRoute } from "./mock-api-import-review-routes";
import type { MockRouteContext, MockRouteResult } from "./mock-api-route-context";

export async function handleMockImportRoute(context: MockRouteContext): MockRouteResult {
  const jobResult = await handleMockImportJobRoute(context);
  if (jobResult !== undefined) return jobResult;

  const { segments } = context;
  if (segments[0] !== "api" || segments[1] !== "import-jobs" || !segments[2]) {
    return undefined;
  }

  const jobId = segments[2];

  if (segments[3] === "advisories") {
    return handleMockAdvisoryRoute(context, jobId);
  }

  return handleMockImportReviewRoute(context, jobId);
}
