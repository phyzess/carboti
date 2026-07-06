import type { ImportJobReview } from "./types";
import {
  confirmPendingRecordsForState,
  decideRecordForState,
  requireJob,
  requireSource,
  respond,
} from "./mock-api-support";
import type { MockRouteContext, MockRouteResult } from "./mock-api-route-context";

export async function handleMockImportReviewRoute(
  context: MockRouteContext,
  jobId: string,
): MockRouteResult {
  const { method, segments, state } = context;

  if (method === "GET" && segments.length === 4 && segments[3] === "review") {
    const job = requireJob(state, jobId);
    const source = requireSource(state, job.sourceFileId);
    const review: ImportJobReview = {
      adapterId: job.adapterId,
      completedAt: job.completedAt,
      createdAt: job.createdAt,
      createdBy: job.createdBy,
      failureClass: job.failureClass,
      failureReason: job.failureReason,
      id: job.id,
      jobKind: job.jobKind,
      sourceFile: {
        contentType: source.contentType,
        filename: source.filename,
        objectKey: source.objectKey,
      },
      sourceFileId: source.id,
      status: job.status,
      updatedAt: job.updatedAt,
    };
    return respond({
      issues: state.issuesByJobId[jobId] ?? [],
      job: review,
      records: state.recordsByJobId[jobId] ?? [],
    });
  }

  if (method === "POST" && segments.length === 5 && segments[3] === "review") {
    if (segments[4] === "confirm-pending") {
      return respond(confirmPendingRecordsForState(state, jobId));
    }
  }

  if (
    method === "POST" &&
    segments.length === 6 &&
    segments[3] === "staged-records" &&
    (segments[5] === "approve" || segments[5] === "reject")
  ) {
    const record = decideRecordForState(
      state,
      jobId,
      segments[4]!,
      segments[5] === "approve" ? "approved" : "rejected",
    );
    return respond({ record });
  }

  return undefined;
}
