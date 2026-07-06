import { createSmokeWebMockApiContext } from "./smoke-context-web-mock-api.mjs";
import { createSmokeWebReviewContext } from "./smoke-context-web-review.mjs";
import { createSmokeWebRuntimeContext } from "./smoke-context-web-runtime.mjs";
import { createSmokeWebShellContext } from "./smoke-context-web-shell.mjs";
import { createSmokeWebWorkspaceContext } from "./smoke-context-web-workspace.mjs";

export function createSmokeWebContext({ sourceTextUnder, text }) {
  return {
    ...createSmokeWebRuntimeContext({ sourceTextUnder, text }),
    ...createSmokeWebShellContext({ text }),
    ...createSmokeWebReviewContext({ text }),
    ...createSmokeWebWorkspaceContext({ text }),
    ...createSmokeWebMockApiContext({ text }),
  };
}
