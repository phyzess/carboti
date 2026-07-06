import { assertWebAuthActionWorkflowGuards } from "./smoke-web-action-auth-guards.mjs";
import { assertWebReviewActionWorkflowGuards } from "./smoke-web-action-review-guards.mjs";
import { assertWebWorkspaceActionWorkflowGuards } from "./smoke-web-action-workspace-guards.mjs";

export function assertWebActionWorkflowGuards(context) {
  assertWebAuthActionWorkflowGuards(context);
  assertWebWorkspaceActionWorkflowGuards(context);
  assertWebReviewActionWorkflowGuards(context);
}
