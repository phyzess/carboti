import { createSmokeWorkerAdvisoryContext } from "./smoke-context-worker-advisory.mjs";
import { createSmokeWorkerAuthContext } from "./smoke-context-worker-auth.mjs";
import { createSmokeWorkerImportContext } from "./smoke-context-worker-import.mjs";
import { createSmokeWorkerInboundContext } from "./smoke-context-worker-inbound.mjs";
import { createSmokeWorkerRuntimeContext } from "./smoke-context-worker-runtime.mjs";
import { createSmokeWorkerSourceContext } from "./smoke-context-worker-source.mjs";

export function createSmokeWorkerContext(ioContext) {
  return {
    ...createSmokeWorkerRuntimeContext(ioContext),
    ...createSmokeWorkerAdvisoryContext(ioContext),
    ...createSmokeWorkerAuthContext(ioContext),
    ...createSmokeWorkerInboundContext(ioContext),
    ...createSmokeWorkerImportContext(ioContext),
    ...createSmokeWorkerSourceContext(ioContext),
  };
}
