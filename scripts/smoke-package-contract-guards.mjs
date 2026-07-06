import { assertPackageAppContractGuards } from "./smoke-package-app-contract-guards.mjs";
import { assertPackageCoreContractGuards } from "./smoke-package-core-contract-guards.mjs";
import { assertPackageManifestGuards } from "./smoke-package-manifest-guards.mjs";

export function assertPackageContractGuards(context) {
  assertPackageCoreContractGuards(context);
  assertPackageAppContractGuards(context);
  assertPackageManifestGuards(context);
}
