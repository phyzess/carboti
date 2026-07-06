import type { Hono } from "hono";
import { readCurrentUser } from "./auth-routes";
import { authError, parseQueryLimit } from "./http-utils";
import { publicSourceFile } from "./source-list-presenters";
import { readSourceFiles } from "./source-list-query";

export function registerSourceListRoute(app: Hono<{ Bindings: Env }>): void {
  app.get("/api/source-files", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }

    const workspaceId = context.req.query("workspaceId") ?? "default";
    const limit = parseQueryLimit(context.req.query("limit"), 50);
    const sourceFiles = await readSourceFiles(context.env, {
      limit,
      workspaceId,
    });

    return context.json({
      sourceFiles: sourceFiles.map(publicSourceFile),
    });
  });
}
