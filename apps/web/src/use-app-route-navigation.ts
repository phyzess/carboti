import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { appRouteFromPath, type AppNavigationPath, type AppRoute } from "./app-routes";
import { authRouteFromPath, type AuthRoute } from "./auth-route";

export type AppRouteNavigation = {
  authRoute: AuthRoute;
  locationPathname: string;
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  route: AppRoute;
};

export function useAppRouteNavigation(): AppRouteNavigation {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const locationPathname = location.pathname;
  const authRoute = useMemo(() => authRouteFromPath(locationPathname), [locationPathname]);
  const route = useMemo(() => appRouteFromPath(locationPathname), [locationPathname]);
  const navigate = useCallback(
    (path: AppNavigationPath, options: { replace?: boolean } = {}) => {
      if (locationPathname === path) return;

      const navigateOptions =
        options.replace === undefined ? { to: path } : { replace: options.replace, to: path };

      void routerNavigate(navigateOptions);
    },
    [locationPathname, routerNavigate],
  );

  return {
    authRoute,
    locationPathname,
    navigate,
    route,
  };
}
