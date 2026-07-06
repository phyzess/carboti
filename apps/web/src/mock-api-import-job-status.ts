import type { ImportJobListItem } from "./types";
import { pushJobEvent } from "./mock-api-events";
import type { MockState } from "./mock-api-state";
import { nowIso } from "./mock-api-time";

export function recalculateJobStatus(
  state: MockState,
  job: ImportJobListItem,
  userId: string,
): void {
  const previous = job.status;
  const records = state.recordsByJobId[job.id] ?? [];
  if (records.some((record) => record.reviewStatus === "pending")) {
    job.status = "needs_review";
    job.completedAt = null;
  } else if (records.some((record) => record.reviewStatus === "approved")) {
    job.status = "approved";
    job.completedAt = null;
  } else {
    job.status = "done";
    job.completedAt = nowIso();
  }
  job.updatedAt = nowIso();
  if (previous !== job.status) {
    pushJobEvent(state, job.id, "import_job.status_changed", "Demo status recalculated.", userId, {
      statusFrom: previous,
      statusTo: job.status,
    });
  }
}

export function updateJobStatus(
  state: MockState,
  job: ImportJobListItem,
  status: string,
  message: string,
  actorUserId: string | null = null,
): void {
  const previous = job.status;
  job.status = status;
  job.updatedAt = nowIso();
  job.completedAt = status === "done" ? nowIso() : null;
  pushJobEvent(state, job.id, "import_job.status_changed", message, actorUserId, {
    statusFrom: previous,
    statusTo: status,
  });
}
