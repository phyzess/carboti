import { AnimatedIcon, type AnimatedIconName, type AppShellNavItem } from "@carboti/ui";
import {
  buildNavigationRouteEntries,
  findActiveNavigationGroup,
  navigationGroups,
  routeAvailable,
  routeMeta,
  routeMetaFor,
  type WorkspaceRouteEntry,
} from "./app-navigation-model";
import { type AppNavigationPath, routePath, type AppRoute } from "./app-routes";
import type { Translate } from "./i18n";

export type { WorkspaceRouteEntry } from "./app-navigation-model";

export type AppNavigationModel = {
  activePrimaryLabel: string;
  activeRouteLabel: string;
  primaryNavigation: AppShellNavItem[];
  routeEntries: WorkspaceRouteEntry[];
  subNavigation: AppShellNavItem[];
};

export function buildNavigation(
  route: AppRoute,
  options: {
    authenticated: boolean;
    canManageUsers?: boolean;
    onNavigate: (path: AppNavigationPath) => void;
    t: Translate;
  },
): AppNavigationModel {
  const { t } = options;

  if (!options.authenticated) {
    return {
      activePrimaryLabel: t("nav.login"),
      activeRouteLabel: t("nav.login"),
      primaryNavigation: [
        {
          label: t("nav.login"),
          icon: navigationIcon("login", 17),
          active: route === "login",
          href: routePath("login"),
          onSelect: () => options.onNavigate(routePath("login")),
        },
      ],
      routeEntries: [],
      subNavigation: [],
    };
  }

  const canManageUsers = Boolean(options.canManageUsers);
  const activeGroup = findActiveNavigationGroup(route);
  const primaryNavigation = navigationGroups.map((group) => {
    const href = routePath(group.defaultRoute);

    return {
      label: t(group.labelKey),
      icon: navigationIcon(group.iconName, 17),
      href,
      active: activeGroup.id === group.id,
      onSelect: () => options.onNavigate(href),
    };
  });
  const subNavigation: AppShellNavItem[] = activeGroup.routes.map((routeId) => {
    const meta = routeMeta[routeId];
    const href = routePath(routeId);
    const disabled = !routeAvailable(routeId, canManageUsers);

    const item: AppShellNavItem = {
      label: t(meta.labelKey),
      icon: navigationIcon(meta.iconName, 15),
      href,
      active: route === routeId,
      disabled,
    };

    if (!disabled) {
      item.onSelect = () => options.onNavigate(href);
    }

    return item;
  });
  const routeEntries = buildNavigationRouteEntries({ canManageUsers, t });
  const activeRoute = routeMetaFor(route);

  return {
    activePrimaryLabel: t(activeGroup.labelKey),
    activeRouteLabel: activeRoute ? t(activeRoute.labelKey) : t(activeGroup.labelKey),
    primaryNavigation,
    routeEntries,
    subNavigation,
  };
}

function navigationIcon(name: AnimatedIconName, size: number) {
  return <AnimatedIcon name={name} size={size} />;
}
