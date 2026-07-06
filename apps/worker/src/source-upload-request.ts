import type { AppContext } from "./http-utils";

type SourceUploadRequestResult =
  | {
      ok: true;
      content: ArrayBuffer;
      contentType: string;
      filename: string;
      workspaceId: string;
    }
  | {
      ok: false;
      response: Response;
    };

export async function readSourceUploadRequest(
  context: AppContext,
): Promise<SourceUploadRequestResult> {
  if (!context.req.raw.body) {
    return {
      ok: false,
      response: context.json(
        {
          error: {
            code: "missing_body",
            message: "Request body is required.",
          },
        },
        400,
      ),
    };
  }

  const content = await context.req.arrayBuffer();
  if (content.byteLength === 0) {
    return {
      ok: false,
      response: context.json(
        {
          error: {
            code: "empty_body",
            message: "Request body must not be empty.",
          },
        },
        400,
      ),
    };
  }

  return {
    ok: true,
    content,
    contentType: context.req.header("content-type") ?? "application/octet-stream",
    filename: context.req.header("x-filename") ?? "source.bin",
    workspaceId: context.req.header("x-workspace-id") ?? "default",
  };
}
