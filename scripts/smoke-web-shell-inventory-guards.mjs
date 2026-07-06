export function assertWebShellInventoryGuards(context) {
  const { assert, exists } = context;

  assert(
    exists("apps/web/src/authenticated-workspace-props.ts") &&
      exists("apps/web/src/review-workspace-route.tsx") &&
      exists("apps/web/src/workspace-shell-routes.tsx") &&
      exists("apps/web/src/workspace-shell-route-content.tsx") &&
      exists("apps/web/src/workspace-shell-route-content-types.ts") &&
      exists("apps/web/src/workspace-route-settings-content.tsx") &&
      exists("apps/web/src/workspace-route-workspace-content.tsx") &&
      exists("apps/web/src/workspace-not-found-route.tsx") &&
      exists("apps/web/src/use-shell-overlay-state.ts") &&
      exists("apps/web/src/workspace-shell-chrome.tsx") &&
      exists("apps/web/src/workspace-shell-chrome-nodes.tsx") &&
      exists("apps/web/src/workspace-shell-search.ts") &&
      exists("apps/web/src/workspace-shell-actions.tsx") &&
      exists("apps/web/src/workspace-loading-shell.tsx") &&
      exists("apps/web/src/app-navigation.tsx") &&
      exists("apps/web/src/app-navigation-model.ts") &&
      exists("apps/web/src/use-app-route-navigation.ts") &&
      exists("apps/web/src/app-route-gate.tsx"),
    "apps/web shell composition modules must exist.",
  );
}
