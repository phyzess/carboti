import * as v from "valibot";

import { StagedRecordStatusSchema, type ImportJobStatus } from "./schemas";
import type { ReviewStatusSummary } from "./types";

export function summarizeReviewStatuses(statuses: Iterable<string>): ReviewStatusSummary {
  const summary: ReviewStatusSummary = {
    pending: 0,
    approved: 0,
    rejected: 0,
    committed: 0,
  };

  for (const status of statuses) {
    const result = v.safeParse(StagedRecordStatusSchema, status);
    if (result.success) {
      summary[result.output] += 1;
    }
  }

  return summary;
}

export function jobStatusForReviewSummary(
  summary: Pick<ReviewStatusSummary, "pending" | "approved" | "committed">,
): ImportJobStatus {
  if (summary.approved > 0) {
    return "approved";
  }

  if (summary.pending > 0) {
    return "needs_review";
  }

  if (summary.committed > 0) {
    return "committed";
  }

  return "needs_review";
}
