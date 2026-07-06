import type { AnimatedIconName } from "@carboti/ui";
import {
  type AppNavigationPath,
  type AppPrimaryRoute,
  primaryRouteFor,
  routePath,
  type AppRoute,
  type WorkspaceAppRoute,
} from "./app-routes";
import type { MessageKey, Translate } from "./i18n";

export type WorkspaceRouteEntry = {
  description: string;
  group: string;
  label: string;
  path: AppNavigationPath;
  route: WorkspaceAppRoute;
};

export type AppNavigationRouteMeta = {
  descriptionKey: MessageKey;
  iconName: AnimatedIconName;
  labelKey: MessageKey;
};

export type AppNavigationGroup = {
  defaultRoute: WorkspaceAppRoute;
  iconName: AnimatedIconName;
  id: AppPrimaryRoute;
  labelKey: MessageKey;
  routes: WorkspaceAppRoute[];
};

export const routeMeta = {
  overview: {
    descriptionKey: "nav.overviewDescription",
    iconName: "workbench",
    labelKey: "nav.overview",
  },
  reviews: {
    descriptionKey: "nav.reviewsDescription",
    iconName: "reviews",
    labelKey: "nav.reviews",
  },
  sources: {
    descriptionKey: "nav.sourcesDescription",
    iconName: "files",
    labelKey: "nav.sources",
  },
  imports: {
    descriptionKey: "nav.importsDescription",
    iconName: "database",
    labelKey: "nav.imports",
  },
  audit: {
    descriptionKey: "nav.auditDescription",
    iconName: "audit",
    labelKey: "nav.audit",
  },
  users: {
    descriptionKey: "nav.usersDescription",
    iconName: "users",
    labelKey: "nav.users",
  },
  account: {
    descriptionKey: "nav.accountDescription",
    iconName: "account",
    labelKey: "nav.account",
  },
} satisfies Record<WorkspaceAppRoute, AppNavigationRouteMeta>;

export const navigationGroups = [
  {
    defaultRoute: "overview",
    iconName: "workbench",
    id: "workbench",
    labelKey: "nav.workbench",
    routes: ["overview", "sources", "imports", "reviews"],
  },
  {
    defaultRoute: "account",
    iconName: "account",
    id: "settings",
    labelKey: "nav.settings",
    routes: ["account", "users", "audit"],
  },
] satisfies AppNavigationGroup[];

export function findActiveNavigationGroup(route: AppRoute): AppNavigationGroup {
  return (
    navigationGroups.find((group) => group.id === primaryRouteFor(route)) ?? navigationGroups[0]!
  );
}

export function routeMetaFor(route: AppRoute): AppNavigationRouteMeta | null {
  return route !== "login" && route !== "not-found" ? routeMeta[route] : null;
}

export function buildNavigationRouteEntries(options: {
  canManageUsers: boolean;
  t: Translate;
}): WorkspaceRouteEntry[] {
  return navigationGroups.flatMap((group) =>
    group.routes
      .filter((routeId) => routeAvailable(routeId, options.canManageUsers))
      .map((routeId) => {
        const meta = routeMeta[routeId];
        return {
          description: options.t(meta.descriptionKey),
          group: options.t(group.labelKey),
          label: options.t(meta.labelKey),
          path: routePath(routeId),
          route: routeId,
        };
      }),
  );
}

export function routeAvailable(route: WorkspaceAppRoute, canManageUsers: boolean): boolean {
  return route !== "users" || canManageUsers;
}
