import { assertWebShellHomeGuards } from "./smoke-web-shell-home-guards.mjs";
import { assertWebShellInventoryGuards } from "./smoke-web-shell-inventory-guards.mjs";
import { assertWebShellNavigationGuards } from "./smoke-web-shell-navigation-guards.mjs";
import { assertWebShellRouteGuards } from "./smoke-web-shell-route-guards.mjs";
import { assertWebShellSearchGuards } from "./smoke-web-shell-search-guards.mjs";

export function assertWebShellCompositionGuards(context) {
  assertWebShellHomeGuards(context);
  assertWebShellInventoryGuards(context);
  assertWebShellSearchGuards(context);
  assertWebShellNavigationGuards(context);
  assertWebShellRouteGuards(context);
}
