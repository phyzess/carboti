import { useEffect } from "react";
import {
  defaultAuthenticatedPath,
  isProtectedRoute,
  loginPath,
  type AppNavigationPath,
  type AppRoute,
} from "./app-routes";
import type { AuthRoute } from "./auth-route";
import type { ApiUser } from "./types";
import type { WebPermissions } from "./web-permissions";
import { selectedJobDataNeededForRoute } from "./workspace-route-data";

export function useWorkspaceRouteLifecycle(options: {
  authRoute: AuthRoute;
  isLoadingSession: boolean;
  isReviewLoaded: (jobId: string) => boolean;
  loadReview: (jobId: string, options?: { updateNotice?: boolean }) => Promise<void>;
  loadUserManagement: () => Promise<void>;
  locationPathname: string;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  permissions: WebPermissions;
  route: AppRoute;
  runAction: (action: () => Promise<void>) => Promise<void>;
  selectedJobId: string | null;
  user: ApiUser | null;
}) {
  const {
    authRoute,
    isLoadingSession,
    isReviewLoaded,
    loadReview,
    loadUserManagement,
    locationPathname,
    navigate,
    permissions,
    route,
    runAction,
    selectedJobId,
    user,
  } = options;

  useEffect(() => {
    if (isLoadingSession || authRoute.kind !== "home") return;

    if (!user && isProtectedRoute(route)) {
      navigate(loginPath, { replace: true });
      return;
    }

    if (user && locationPathname === "/") {
      navigate(defaultAuthenticatedPath, { replace: true });
      return;
    }

    if (user && route === "login") {
      navigate(defaultAuthenticatedPath, { replace: true });
    }
  }, [authRoute.kind, isLoadingSession, locationPathname, route, user]);

  useEffect(() => {
    if (route !== "users" || !user || !permissions.canManageUsers) return;
    void loadUserManagement();
  }, [permissions.canManageUsers, route, user]);

  useEffect(() => {
    if (!user || !selectedJobId || !selectedJobDataNeededForRoute(route)) return;
    if (isReviewLoaded(selectedJobId)) return;

    void runAction(async () => {
      await loadReview(selectedJobId, {
        updateNotice: route === "reviews",
      });
    });
  }, [isReviewLoaded, loadReview, route, selectedJobId, user]);
}
