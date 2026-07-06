import { pushAudit } from "./mock-api-events";
import { updateJobStatus } from "./mock-api-import-job-status";
import { commitJob } from "./mock-api-review-commit-operations";
import { requireJob, requireUser } from "./mock-api-selectors";
import { writeState, type MockState } from "./mock-api-state";

export function drainQueuedImportJobs(state: MockState) {
  requireUser(state);
  const queued = state.importJobs.filter((job) => job.status === "queued");
  for (const job of queued) {
    updateJobStatus(state, job, "needs_review", "Demo queue drained.");
  }
  writeState(state);
  return {
    processedCount: queued.length,
    processedJobIds: queued.map((job) => job.id),
  };
}

export function commitImportJobForState(state: MockState, jobId: string) {
  const user = requireUser(state);
  const result = commitJob(state, jobId, user.id);
  writeState(state);
  return result;
}

export function retryImportJobForState(state: MockState, jobId: string) {
  const user = requireUser(state);
  const job = requireJob(state, jobId);
  job.failureClass = null;
  job.failureReason = null;
  updateJobStatus(state, job, "needs_review", "Demo retry prepared records.", user.id);
  pushAudit(
    state,
    "import_job.retried",
    { id: job.id, kind: "import_job" },
    { demo: true },
    user.id,
  );
  writeState(state);
  return {
    importJobId: job.id,
    status: job.status,
  };
}
