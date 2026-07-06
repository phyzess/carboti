import { carbotiRawHttpObjectKey } from "@carboti/core";
import { hashSourceContent } from "@carboti/files";
import type { Hono } from "hono";
import { requireCarbotiApiClient } from "./carboti-api-auth";
import { prepareCarbotiHttpIngestStatements } from "./carboti-http-ingest-statements";
import { createSourceFileImportJob } from "./source-intake";

const textArtifactByteLimit = 64_000;

export function registerCarbotiHttpIngestRoute(app: Hono<{ Bindings: Env }>): void {
  app.post("/api/carboti/ingest/http", async (context) => {
    const auth = await requireCarbotiApiClient(context, "ingest:write");
    if (!auth.ok) return auth.response;

    if (!context.req.raw.body) {
      return context.json(
        {
          error: {
            code: "missing_body",
            message: "Request body is required.",
          },
        },
        400,
      );
    }

    const content = await context.req.arrayBuffer();
    if (content.byteLength === 0) {
      return context.json(
        {
          error: {
            code: "empty_body",
            message: "Request body must not be empty.",
          },
        },
        400,
      );
    }

    const receivedAt = new Date().toISOString();
    const messageId = crypto.randomUUID();
    const filename =
      context.req.header("x-carboti-filename") ?? context.req.header("x-filename") ?? "source.bin";
    const contentType = context.req.header("content-type") ?? "application/octet-stream";
    const contentHash = await hashSourceContent(content);
    const rawObjectKey = carbotiRawHttpObjectKey({
      filename,
      messageId,
      receivedAt,
    });

    await context.env.SOURCE_FILES.put(rawObjectKey, content, {
      customMetadata: {
        apiClientId: auth.client.id,
        contentHash,
        messageId,
        source: "http_upload",
      },
      httpMetadata: {
        contentType,
      },
    });

    let sourceResult = null;
    try {
      sourceResult = await createSourceFileImportJob(context.env, {
        actor: {
          id: `api_client:${auth.client.id}`,
          kind: "system",
        },
        content,
        contentType,
        filename,
        metadata: {
          carbotiMessageId: messageId,
          rawObjectKey,
          source: "http_upload",
        },
        workspaceId: auth.client.workspaceId,
      });
    } catch {
      sourceResult = null;
    }

    const prepared = prepareCarbotiHttpIngestStatements(context.env, {
      client: auth.client,
      contentHash,
      contentType,
      filename,
      messageId,
      rawObjectKey,
      rawSize: content.byteLength,
      receivedAt,
      sourceResult,
      textBody: textArtifactFor(content, contentType),
    });

    try {
      await context.env.DB.batch(prepared.statements);
    } catch (error) {
      await context.env.SOURCE_FILES.delete(rawObjectKey);
      throw error;
    }

    return context.json(
      {
        artifacts: prepared.metadata.artifactIds.map((id) => ({ id })),
        importPipeline: sourceResultSummary(sourceResult),
        messageId,
        normalizedMessageObjectId: prepared.metadata.normalizedMessageObjectId,
        rawObject: {
          contentHash,
          contentType,
          id: prepared.metadata.rawObjectId,
          objectKey: rawObjectKey,
          size: content.byteLength,
        },
        status: "accepted",
      },
      202,
    );
  });
}

function textArtifactFor(content: ArrayBuffer, contentType: string): string | null {
  if (!isTextualContentType(contentType) || content.byteLength > textArtifactByteLimit) {
    return null;
  }

  return new TextDecoder().decode(content);
}

function isTextualContentType(contentType: string): boolean {
  const normalized = contentType.toLowerCase();
  return (
    normalized.startsWith("text/") ||
    normalized.includes("json") ||
    normalized.includes("xml") ||
    normalized.includes("csv")
  );
}

function sourceResultSummary(
  result: Awaited<ReturnType<typeof createSourceFileImportJob>> | null,
): Record<string, unknown> {
  if (!result) {
    return {
      status: "not_supported",
    };
  }

  if (!result.ok) {
    return {
      code: result.code,
      importJobId: result.importJobId ?? null,
      objectKey: result.objectKey ?? null,
      sourceFileId: result.sourceFileId ?? null,
      status: result.code,
    };
  }

  return {
    duplicate: result.duplicate,
    importJobId: result.importJobId,
    objectKey: result.objectKey,
    sourceFileId: result.sourceFileId,
    status: result.status,
  };
}
