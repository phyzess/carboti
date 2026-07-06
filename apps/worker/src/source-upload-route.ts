import type { Hono } from "hono";
import { readCurrentUser, requirePermission } from "./auth-routes";
import { requestFingerprint } from "./event-store";
import { authError } from "./http-utils";
import { createSourceFileImportJob } from "./source-intake";
import { sourceUploadResultResponse } from "./source-upload-presenters";
import { readSourceUploadRequest } from "./source-upload-request";

export function registerSourceUploadRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/source-files", async (context) => {
    const current = await readCurrentUser(context);
    if (!current) {
      return authError(context, "unauthorized", "Login is required.", 401);
    }
    const denied = await requirePermission(context, current, "source_file:upload");
    if (denied) return denied;

    const upload = await readSourceUploadRequest(context);
    if (!upload.ok) return upload.response;

    const fingerprint = await requestFingerprint(context);
    const result = await createSourceFileImportJob(context.env, {
      actor: {
        id: current.user.id,
        kind: "user",
      },
      content: upload.content,
      contentType: upload.contentType,
      filename: upload.filename,
      requestId: fingerprint.requestId,
      workspaceId: upload.workspaceId,
    });

    return sourceUploadResultResponse(context, result);
  });
}
