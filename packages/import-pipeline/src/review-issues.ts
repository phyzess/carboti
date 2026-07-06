import type { ReviewIssue } from "./types";

export function createManualReviewIssue(): ReviewIssue {
  return {
    code: "manual_review_required",
    message: "Record was staged and requires human confirmation before commit.",
    severity: "info",
  };
}
