import type { WorkerImportAdapter } from "./import-adapters";
import { prepareImportJobNeedsReviewStatements } from "./import-job-staging-completion-statements";
import {
  prepareStagedImportRowStatements,
  type StagedImportRow,
} from "./import-job-staging-row-statements";

export function prepareImportJobStagingStatements(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    importJobId: string;
    objectKey: string;
    sourceFileId: string;
    stagedAt: string;
    stagedRows: StagedImportRow[];
  },
): D1PreparedStatement[] {
  return [
    ...input.stagedRows.flatMap((row) =>
      prepareStagedImportRowStatements(env, {
        adapter: input.adapter,
        importJobId: input.importJobId,
        row,
        sourceFileId: input.sourceFileId,
        stagedAt: input.stagedAt,
      }),
    ),
    ...prepareImportJobNeedsReviewStatements(env, {
      adapter: input.adapter,
      importJobId: input.importJobId,
      objectKey: input.objectKey,
      sourceFileId: input.sourceFileId,
      stagedAt: input.stagedAt,
      stagedCount: input.stagedRows.length,
    }),
  ];
}
