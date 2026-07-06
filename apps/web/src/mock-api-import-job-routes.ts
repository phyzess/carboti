import {
  commitImportJobForState,
  drainQueuedImportJobs,
  limited,
  requireJob,
  requireUser,
  retryImportJobForState,
  respond,
} from "./mock-api-support";
import type { MockRouteContext, MockRouteResult } from "./mock-api-route-context";

export async function handleMockImportJobRoute(context: MockRouteContext): MockRouteResult {
  const { method, segments, state, url } = context;

  if (method === "GET" && url.pathname === "/api/import-jobs") {
    requireUser(state);
    const status = url.searchParams.get("status");
    const jobs = status
      ? state.importJobs.filter((job) => job.status === status)
      : state.importJobs;
    return respond({
      importJobs: limited(jobs, url),
    });
  }

  if (method === "POST" && url.pathname === "/api/dev/import-jobs/drain") {
    return respond(drainQueuedImportJobs(state));
  }

  if (segments[0] !== "api" || segments[1] !== "import-jobs" || !segments[2]) {
    return undefined;
  }

  const jobId = segments[2];

  if (method === "GET" && segments.length === 4 && segments[3] === "events") {
    requireJob(state, jobId);
    return respond({
      events: limited(state.importJobEventsByJobId[jobId] ?? [], url),
    });
  }

  if (method === "POST" && segments.length === 4 && segments[3] === "commit") {
    return respond(commitImportJobForState(state, jobId));
  }

  if (method === "POST" && segments.length === 4 && segments[3] === "retry") {
    return respond(retryImportJobForState(state, jobId));
  }

  return undefined;
}
