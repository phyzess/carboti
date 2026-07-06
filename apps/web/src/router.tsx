import {
  createRootRoute,
  createRoute,
  createRouter,
  type ErrorRouteProps,
} from "@tanstack/react-router";
import { App } from "./app";

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: App,
  errorComponent: RouterErrorBoundary,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
});

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "workspace",
});

const sourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "workspace/sources",
});

const importsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "workspace/imports",
});

const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "workspace/reviews",
});

const auditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "settings/audit",
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "settings/members",
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "settings",
});

const inviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "invite/$token",
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "reset-password/$token",
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  overviewRoute,
  sourcesRoute,
  importsRoute,
  reviewsRoute,
  auditRoute,
  usersRoute,
  accountRoute,
  inviteRoute,
  resetPasswordRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function RouterErrorBoundary(props: ErrorRouteProps) {
  throw props.error;
}
