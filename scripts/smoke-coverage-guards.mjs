import { assertBrowserSmokeCoverageGuards } from "./smoke-coverage-browser-guards.mjs";
import { assertI18nCoverageGuards } from "./smoke-coverage-i18n-guards.mjs";
import { assertPackageInterfaceCoverageGuards } from "./smoke-coverage-package-interface-guards.mjs";
import { assertWorkerIntegrationCoverageGuards } from "./smoke-coverage-worker-integration-guards.mjs";

export function assertCoverageGuards(context) {
  assertWorkerIntegrationCoverageGuards(context);
  assertPackageInterfaceCoverageGuards(context);
  assertBrowserSmokeCoverageGuards(context);
  assertI18nCoverageGuards(context);
}
