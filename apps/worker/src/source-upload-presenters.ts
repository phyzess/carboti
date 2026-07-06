import type { AppContext } from "./http-utils";
import type { SourceIntakeResult } from "./source-intake-types";

export function sourceUploadResultResponse(
  context: AppContext,
  result: SourceIntakeResult,
): Response {
  if (!result.ok) {
    return context.json(
      {
        error: {
          code: result.code,
          message: result.message,
        },
        ...(result.sourceFileId ? { sourceFileId: result.sourceFileId } : {}),
        ...(result.importJobId ? { importJobId: result.importJobId } : {}),
        ...(result.objectKey ? { objectKey: result.objectKey } : {}),
        ...(result.code === "queue_dispatch_failed" ? { status: "failed" } : {}),
      },
      result.status,
    );
  }

  if (result.duplicate) {
    return context.json({
      sourceFileId: result.sourceFileId,
      importJobId: result.importJobId,
      objectKey: result.objectKey,
      status: result.status,
      duplicate: true,
    });
  }

  return context.json(
    {
      sourceFileId: result.sourceFileId,
      importJobId: result.importJobId,
      objectKey: result.objectKey,
      status: result.status,
    },
    202,
  );
}
