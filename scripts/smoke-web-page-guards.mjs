import { assertWebAuditPageGuards } from "./smoke-web-audit-page-guards.mjs";
import { assertWebImportPageGuards } from "./smoke-web-import-page-guards.mjs";
import { assertWebPageInventoryGuards } from "./smoke-web-page-inventory-guards.mjs";
import { assertWebPageSharedGuards } from "./smoke-web-page-shared-guards.mjs";
import { assertWebSourcePageGuards } from "./smoke-web-source-page-guards.mjs";

export function assertWebPageCompositionGuards(context) {
  assertWebPageInventoryGuards(context);
  assertWebAuditPageGuards(context);
  assertWebSourcePageGuards(context);
  assertWebImportPageGuards(context);
  assertWebPageSharedGuards(context);
}
