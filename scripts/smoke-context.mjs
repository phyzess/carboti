import process from "node:process";
import { createSmokeDocsContext } from "./smoke-context-docs.mjs";
import {
  caseSensitiveForbiddenTerm,
  collectMatches,
  forbiddenTerm,
} from "./smoke-context-helpers.mjs";
import { createSmokeIo } from "./smoke-context-io.mjs";
import { createSmokeNeutralityContext } from "./smoke-context-neutrality.mjs";
import { createSmokePackageContext } from "./smoke-context-package.mjs";
import { createSmokeScriptsContext } from "./smoke-context-scripts.mjs";
import { createSmokeWebContext } from "./smoke-context-web.mjs";
import { createSmokeWorkerContext } from "./smoke-context-worker.mjs";

export function createSmokeContext(root = process.cwd()) {
  const ioContext = createSmokeIo(root);
  const helperContext = { caseSensitiveForbiddenTerm, collectMatches, forbiddenTerm };
  const packageContext = createSmokePackageContext(ioContext);
  const workerContext = createSmokeWorkerContext(ioContext);
  const webContext = createSmokeWebContext(ioContext);
  const scriptContext = createSmokeScriptsContext(ioContext);
  const docsContext = createSmokeDocsContext(ioContext);
  const neutralityContext = createSmokeNeutralityContext({
    caseSensitiveForbiddenTerm,
    docsContext,
    forbiddenTerm,
    packageContext,
    scriptContext,
    text: ioContext.text,
    webContext,
    workerContext,
  });

  return {
    ...packageContext,
    ...scriptContext,
    ...docsContext,
    ...neutralityContext,
    ...helperContext,
    ...ioContext,
    ...webContext,
    ...workerContext,
  };
}
