import { prepareQueuedImportJobStatements } from "./source-intake-import-job-statements";
import { prepareSourceFileUploadedStatements } from "./source-intake-source-file-statements";
import type { SourceIntakeActor } from "./source-intake-types";

export type SourceFileImportJobInsertInput = {
  actor: SourceIntakeActor;
  adapterId: string;
  contentHash: string;
  contentType: string;
  filename: string;
  idempotencyKey: string;
  importJobId: string;
  jobKind: string;
  metadata?: Record<string, unknown> | undefined;
  objectKey: string;
  requestId?: string | null | undefined;
  size: number;
  sourceFileId: string;
  uploadedAt: string;
  workspaceId: string;
};

export function prepareSourceFileImportJobInserts(
  env: Env,
  input: SourceFileImportJobInsertInput,
): D1PreparedStatement[] {
  return [
    ...prepareSourceFileUploadedStatements(env, input),
    ...prepareQueuedImportJobStatements(env, input),
  ];
}
