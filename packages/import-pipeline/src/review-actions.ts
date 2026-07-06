import type {
  ConfirmationRecordDecisionAction,
  ConfirmationRecordStatus,
  ReviewRecordDecisionAction,
  StagedRecordStatus,
} from "./schemas";

export function stagedStatusForReviewAction(
  action: ReviewRecordDecisionAction,
): Extract<StagedRecordStatus, "approved" | "rejected"> {
  return action === "approve" ? "approved" : "rejected";
}

export function reviewActionForConfirmationAction(
  action: ConfirmationRecordDecisionAction,
): ReviewRecordDecisionAction {
  return action === "confirm" ? "approve" : "reject";
}

export function confirmationActionForReviewAction(
  action: ReviewRecordDecisionAction,
): ConfirmationRecordDecisionAction {
  return action === "approve" ? "confirm" : "exclude";
}

export function stagedStatusForConfirmationAction(
  action: ConfirmationRecordDecisionAction,
): Extract<StagedRecordStatus, "approved" | "rejected"> {
  return stagedStatusForReviewAction(reviewActionForConfirmationAction(action));
}

export function confirmationStatusForStagedStatus(
  status: StagedRecordStatus,
): ConfirmationRecordStatus {
  if (status === "approved") return "confirmed";
  if (status === "rejected") return "excluded";
  return status;
}
