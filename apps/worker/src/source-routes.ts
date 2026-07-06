import type { Hono } from "hono";
import { registerSourceListRoute } from "./source-list-route";
import { registerSourceUploadRoute } from "./source-upload-route";

export function registerSourceRoutes(app: Hono<{ Bindings: Env }>): void {
  registerSourceListRoute(app);
  registerSourceUploadRoute(app);
}
