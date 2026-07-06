import type { AppRoute } from "./app-routes";

export function selectedJobDataNeededForRoute(route: AppRoute): boolean {
  return route === "reviews" || route === "imports";
}
