import { assertPackageManifestEnvGuards } from "./smoke-package-manifest-env-guards.mjs";
import { assertPackageManifestWebGuards } from "./smoke-package-manifest-web-guards.mjs";
import { assertPackageManifestWorkerGuards } from "./smoke-package-manifest-worker-guards.mjs";
import { assertPackageManifestWorkerScriptGuards } from "./smoke-package-manifest-worker-script-guards.mjs";

export function assertPackageManifestGuards(context) {
  assertPackageManifestWorkerGuards(context);
  assertPackageManifestWorkerScriptGuards(context);
  assertPackageManifestWebGuards(context);
  assertPackageManifestEnvGuards(context);
}
