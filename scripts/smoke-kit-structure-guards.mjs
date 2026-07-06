import { assertKitDocumentationGuards } from "./smoke-kit-documentation-guards.mjs";
import { assertKitInventoryGuards } from "./smoke-kit-inventory-guards.mjs";
import { assertKitPackageExampleGuards } from "./smoke-kit-package-example-guards.mjs";
import { assertKitTemplateGuards } from "./smoke-kit-template-guards.mjs";
import { assertKitToolchainGuards } from "./smoke-kit-toolchain-guards.mjs";

export function assertKitStructureGuards(context) {
  assertKitToolchainGuards(context);
  assertKitInventoryGuards(context);
  assertKitTemplateGuards(context);
  assertKitPackageExampleGuards(context);
  assertKitDocumentationGuards(context);
}
