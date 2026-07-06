import { assertWebActionWorkflowGuards } from "./smoke-web-action-workflow-guards.mjs";
import { assertWebReviewConsoleGuards } from "./smoke-web-review-console-guards.mjs";
import { assertWebTopLevelCompositionGuards } from "./smoke-web-top-level-composition-guards.mjs";
import { assertWebWorkflowInventoryGuards } from "./smoke-web-workflow-inventory-guards.mjs";

export function assertWebWorkflowCompositionGuards(context) {
  assertWebWorkflowInventoryGuards(context);
  assertWebReviewConsoleGuards(context);
  assertWebActionWorkflowGuards(context);
  assertWebTopLevelCompositionGuards(context);
}
