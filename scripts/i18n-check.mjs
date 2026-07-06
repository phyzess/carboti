import process from "node:process";

import { createI18nCheckContext } from "./i18n-check-context.mjs";
import { assertI18nPackageBoundary } from "./i18n-check-package-guards.mjs";
import { assertI18nTemplateAndSmokeCoverage } from "./i18n-check-template-guards.mjs";
import { assertWebI18nCoverage } from "./i18n-check-web-guards.mjs";
import { assertWorkerI18nLocale } from "./i18n-check-worker-guards.mjs";

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const context = {
  ...createI18nCheckContext({ root: process.cwd() }),
  assert,
};

assertI18nPackageBoundary(context);
assertWebI18nCoverage(context);
assertWorkerI18nLocale(context);
assertI18nTemplateAndSmokeCoverage(context);

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`i18n check: ${failure}`);
  }
  console.error(`i18n checks failed with ${failures.length} failure(s).`);
  process.exit(1);
}

console.log("i18n checks passed.");
