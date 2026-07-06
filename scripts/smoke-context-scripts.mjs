import { createAdoptionScriptsContext } from "./smoke-context-adoption-scripts.mjs";
import { createBrowserScriptsContext } from "./smoke-context-browser-scripts.mjs";
import { createCheckScriptsContext } from "./smoke-context-check-scripts.mjs";
import { createOperationsScriptsContext } from "./smoke-context-operations-scripts.mjs";
import { createRuntimeScriptsContext } from "./smoke-context-runtime-scripts.mjs";
import { createWorkerIntegrationScriptsContext } from "./smoke-context-worker-integration-scripts.mjs";

export function createSmokeScriptsContext({ text }) {
  return {
    ...createAdoptionScriptsContext({ text }),
    ...createBrowserScriptsContext({ text }),
    ...createCheckScriptsContext({ text }),
    ...createOperationsScriptsContext({ text }),
    ...createRuntimeScriptsContext({ text }),
    ...createWorkerIntegrationScriptsContext({ text }),
  };
}
