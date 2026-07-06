import { buildSourceFileKey, hashSourceContent } from "@carboti/files";
import { selectImportAdapter } from "./import-adapters";
import { dispatchSourceImportJob } from "./source-intake-dispatch";
import { persistSourceFileImportJob } from "./source-intake-persistence";
import { findDuplicateSourceFile } from "./source-intake-store";
import type { SourceIntakeInput, SourceIntakeResult } from "./source-intake-types";

export type {
  SourceIntakeActor,
  SourceIntakeInput,
  SourceIntakeResult,
} from "./source-intake-types";

export async function createSourceFileImportJob(
  env: Env,
  input: SourceIntakeInput,
): Promise<SourceIntakeResult> {
  const adapter = selectImportAdapter({
    contentType: input.contentType,
    filename: input.filename,
  });
  if (!adapter) {
    return {
      code: "unsupported_source_file",
      message: "No import adapter can handle this source file.",
      ok: false,
      status: 415,
    };
  }

  const sourceFileId = crypto.randomUUID();
  const jobId = crypto.randomUUID();
  const size = input.content.byteLength;
  const contentHash = await hashSourceContent(input.content);
  const idempotencyKey = `${input.workspaceId}:${contentHash}`;
  const now = new Date().toISOString();
  const duplicate = await findDuplicateSourceFile(env, {
    contentHash,
    workspaceId: input.workspaceId,
  });

  if (duplicate) {
    return {
      duplicate: true,
      importJobId: duplicate.import_job_id,
      objectKey: duplicate.object_key,
      ok: true,
      sourceFileId: duplicate.source_file_id,
      status: duplicate.status,
    };
  }

  const objectKey = buildSourceFileKey({
    filename: input.filename,
    sourceFileId,
    workspaceId: input.workspaceId,
  });

  await persistSourceFileImportJob(env, {
    actor: input.actor,
    adapterId: adapter.id,
    content: input.content,
    contentHash,
    contentType: input.contentType,
    filename: input.filename,
    idempotencyKey,
    importJobId: jobId,
    jobKind: adapter.jobKind,
    metadata: input.metadata,
    objectKey,
    requestId: input.requestId,
    size,
    sourceFileId,
    uploadedAt: now,
    workspaceId: input.workspaceId,
  });

  const dispatchFailure = await dispatchSourceImportJob(env, {
    jobId,
    message: {
      jobId,
      kind: "import.source_file",
      objectKey,
      requestedBy: input.actor.id,
      sourceFileId,
    },
    objectKey,
    sourceFileId,
  });
  if (dispatchFailure) {
    return dispatchFailure;
  }

  return {
    duplicate: false,
    importJobId: jobId,
    objectKey,
    ok: true,
    sourceFileId,
    status: "queued",
  };
}
