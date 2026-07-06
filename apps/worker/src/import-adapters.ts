import type { CommitApprovedContext, ReviewIssue } from "@carboti/import-pipeline";
import { parseStarterStagedRecord, starterImportReviewAdapter } from "./features/import-review";
import { parseStarterJsonStagedRecord, starterJsonRecordsAdapter } from "./features/json-records";
import { starterReviewStore } from "./features/starter-review-store";
import type { WorkerReviewStore } from "./import-review-store";

export type WorkerImportAdapter = {
  id: string;
  jobKind: string;
  canHandle(source: { filename: string; contentType: string }): boolean;
  parseAndStage(source: ReadableStream<Uint8Array>): Promise<
    Array<{
      payload: unknown;
      issues: ReviewIssue[];
    }>
  >;
  commitApproved(records: unknown[], context: CommitApprovedContext): Promise<unknown[]>;
  reviewStore: WorkerReviewStore;
};

const registeredImportAdapters = [
  {
    id: starterImportReviewAdapter.id,
    jobKind: "starter.source-file",
    canHandle(source) {
      return starterImportReviewAdapter.canHandle(source);
    },
    async parseAndStage(source: ReadableStream<Uint8Array>) {
      const parsed = await starterImportReviewAdapter.parse(source);
      const staged = await starterImportReviewAdapter.stage(parsed);
      return staged.map((record) => ({
        payload: record,
        issues: starterImportReviewAdapter.validate(record),
      }));
    },
    async commitApproved(records: unknown[], context: CommitApprovedContext) {
      return starterImportReviewAdapter.commitApproved({
        records: records.map(parseStarterStagedRecord),
        context,
      });
    },
    reviewStore: starterReviewStore,
  },
  {
    id: starterJsonRecordsAdapter.id,
    jobKind: "starter.json-records",
    canHandle(source) {
      return starterJsonRecordsAdapter.canHandle(source);
    },
    async parseAndStage(source: ReadableStream<Uint8Array>) {
      const parsed = await starterJsonRecordsAdapter.parse(source);
      const staged = await starterJsonRecordsAdapter.stage(parsed);
      return staged.map((record) => ({
        payload: record,
        issues: starterJsonRecordsAdapter.validate(record),
      }));
    },
    async commitApproved(records: unknown[], context: CommitApprovedContext) {
      return starterJsonRecordsAdapter.commitApproved({
        records: records.map(parseStarterJsonStagedRecord),
        context,
      });
    },
    reviewStore: starterReviewStore,
  },
] satisfies WorkerImportAdapter[];

export function selectImportAdapter(source: {
  filename: string;
  contentType: string;
}): WorkerImportAdapter | null {
  return registeredImportAdapters.find((adapter) => adapter.canHandle(source)) ?? null;
}

export function getImportAdapter(adapterId: string | null): WorkerImportAdapter | null {
  if (!adapterId) {
    return null;
  }

  return registeredImportAdapters.find((adapter) => adapter.id === adapterId) ?? null;
}
