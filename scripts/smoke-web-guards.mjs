import { assertWebMockApiCompositionGuards } from "./smoke-web-mock-api-guards.mjs";
import { assertWebPageCompositionGuards } from "./smoke-web-page-guards.mjs";
import { assertWebShellCompositionGuards } from "./smoke-web-shell-guards.mjs";
import { assertWebWorkflowCompositionGuards } from "./smoke-web-workflow-guards.mjs";

export function assertWebCompositionGuards(context) {
  assertWebShellCompositionGuards(context);
  assertWebPageCompositionGuards(context);
  assertWebMockApiCompositionGuards(context);
  assertWebWorkflowCompositionGuards(context);
}
