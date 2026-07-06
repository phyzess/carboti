export type AppRoute =
  | "overview"
  | "sources"
  | "imports"
  | "reviews"
  | "audit"
  | "users"
  | "account"
  | "login"
  | "not-found";

export type WorkspaceAppRoute = Exclude<AppRoute, "login" | "not-found">;
export type AppPrimaryRoute = "workbench" | "settings";

export const defaultAuthenticatedPath = "/workspace";
export const loginPath = "/login";
export const appNavigationPaths = [
  "/",
  "/workspace",
  "/workspace/sources",
  "/workspace/imports",
  "/workspace/reviews",
  "/settings",
  "/settings/members",
  "/settings/audit",
  "/login",
] as const;
export type AppNavigationPath = (typeof appNavigationPaths)[number];

const routeByPath = new Map<string, AppRoute>([
  ["/", "overview"],
  ["/workspace", "overview"],
  ["/workspace/sources", "sources"],
  ["/workspace/imports", "imports"],
  ["/workspace/reviews", "reviews"],
  ["/settings", "account"],
  ["/settings/members", "users"],
  ["/settings/audit", "audit"],
  [loginPath, "login"],
]);

const pathByRoute = {
  overview: "/workspace",
  sources: "/workspace/sources",
  imports: "/workspace/imports",
  reviews: "/workspace/reviews",
  audit: "/settings/audit",
  users: "/settings/members",
  account: "/settings",
  login: loginPath,
} satisfies Record<Exclude<AppRoute, "not-found">, AppNavigationPath>;

export function appRouteFromPath(pathname: string): AppRoute {
  const path = normalizePath(pathname);
  return routeByPath.get(path) ?? "not-found";
}

export function isProtectedRoute(route: AppRoute): boolean {
  return route !== "login";
}

export function isWorkspaceAppRoute(route: AppRoute): route is WorkspaceAppRoute {
  return route !== "login" && route !== "not-found";
}

export function primaryRouteFor(route: AppRoute): AppPrimaryRoute | null {
  switch (route) {
    case "overview":
    case "sources":
    case "imports":
    case "reviews":
      return "workbench";
    case "audit":
    case "users":
    case "account":
      return "settings";
    case "login":
    case "not-found":
      return null;
  }
}

export function routePath(route: Exclude<AppRoute, "not-found">): AppNavigationPath {
  return pathByRoute[route];
}

export function isAppNavigationPath(path: string): path is AppNavigationPath {
  return appNavigationPaths.includes(path as AppNavigationPath);
}

function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}
