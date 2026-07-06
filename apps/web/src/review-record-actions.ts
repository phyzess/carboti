import {
  createReviewCommitActions,
  type ReviewCommitActionsOptions,
} from "./review-commit-actions";
import {
  createReviewDecisionActions,
  type ReviewDecisionActionsOptions,
} from "./review-record-decision-actions";

type ReviewRecordActionsOptions = ReviewCommitActionsOptions & ReviewDecisionActionsOptions;

export function createReviewRecordActions(options: ReviewRecordActionsOptions) {
  const commitActions = createReviewCommitActions(options);
  const decisionActions = createReviewDecisionActions(options);

  return {
    ...commitActions,
    ...decisionActions,
  };
}
