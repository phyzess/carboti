import {
  createManualReviewIssue,
  type ReviewIssue,
  sourceRowKeyForIndex,
  stagedRecordKeyForSourceRow,
} from "@carboti/import-pipeline";
import type { WorkerImportAdapter } from "./import-adapters";
import { prepareImportJobStagingStatements } from "./import-job-staging-persistence";

export async function stageImportJobRecords(
  env: Env,
  input: {
    adapter: WorkerImportAdapter;
    importJobId: string;
    objectKey: string;
    sourceFileId: string;
    stagedAt: string;
    stagedRecords: Array<{
      issues: ReviewIssue[];
      payload: unknown;
    }>;
  },
): Promise<number> {
  const stagedRows = await Promise.all(
    input.stagedRecords.map(async (record, index) => {
      const rowIndex = index + 1;
      const stagedRecordKey = stagedRecordKeyForSourceRow({
        sourceFileId: input.sourceFileId,
        rowIndex,
      });
      const existingStagedRecord = await input.adapter.reviewStore.readStagedRecordByKey(env, {
        importJobId: input.importJobId,
        stagedRecordKey,
      });

      return {
        id: existingStagedRecord?.id ?? crypto.randomUUID(),
        stagedRecordKey,
        sourceRowKey: sourceRowKeyForIndex(rowIndex),
        payloadJson: JSON.stringify(record.payload),
        issues: [createManualReviewIssue(), ...record.issues],
      };
    }),
  );

  await env.DB.batch(
    prepareImportJobStagingStatements(env, {
      adapter: input.adapter,
      importJobId: input.importJobId,
      objectKey: input.objectKey,
      sourceFileId: input.sourceFileId,
      stagedAt: input.stagedAt,
      stagedRows,
    }),
  );

  return stagedRows.length;
}
