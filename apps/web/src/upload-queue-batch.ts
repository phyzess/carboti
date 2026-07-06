import type { Dispatch, SetStateAction } from "react";
import { uploadSourceFile } from "./api";
import type { NoticeDescriptor } from "./app-notice";
import { errorMessage } from "./app-session";
import type { Translate } from "./i18n";
import type { UploadQueueEntry } from "./types";

export type UploadQueueBatchOptions = {
  loadWorkspace: (preferredJobId?: string) => Promise<void>;
  setBusy: (busy: boolean) => void;
  setError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
  setUploadQueue: Dispatch<SetStateAction<UploadQueueEntry[]>>;
  t: Translate;
};

export async function runUploadQueueBatch(
  options: UploadQueueBatchOptions,
  entries: UploadQueueEntry[],
) {
  options.setBusy(true);
  options.setError(null);

  let lastImportJobId: string | null = null;
  let duplicateCount = 0;
  let failedCount = 0;
  let uploadedCount = 0;
  const completedEntryIds: string[] = [];

  try {
    for (const entry of entries) {
      updateUploadQueueEntry(options, entry.id, {
        error: undefined,
        status: "uploading",
      });

      try {
        const upload = await uploadSourceFile({
          file: entry.file,
          workspaceId: "default",
        });
        lastImportJobId = upload.importJobId;
        completedEntryIds.push(entry.id);
        uploadedCount += 1;
        if (upload.duplicate) duplicateCount += 1;
        updateUploadQueueEntry(options, entry.id, {
          importJobId: upload.importJobId,
          status: upload.duplicate ? "duplicate" : "uploaded",
        });
      } catch (caught) {
        failedCount += 1;
        updateUploadQueueEntry(options, entry.id, {
          error: errorMessage(caught),
          status: "failed",
        });
      }
    }

    if (lastImportJobId) {
      await options.loadWorkspace(lastImportJobId);
    }

    if (completedEntryIds.length > 0) {
      const completedEntryIdSet = new Set(completedEntryIds);
      options.setUploadQueue((current) =>
        current.filter((item) => !completedEntryIdSet.has(item.id)),
      );
    }

    if (failedCount > 0) {
      options.setError(options.t("notice.uploadBatchFailed", { count: String(failedCount) }));
    }
    if (uploadedCount > 0) {
      options.setNotice({
        key:
          duplicateCount > 0 && duplicateCount === uploadedCount
            ? "notice.duplicateSource"
            : "notice.sourceUploaded",
      });
    }
  } finally {
    options.setBusy(false);
  }
}

function updateUploadQueueEntry(
  options: UploadQueueBatchOptions,
  itemId: string,
  patch: Partial<Omit<UploadQueueEntry, "file" | "id">>,
) {
  options.setUploadQueue((current) =>
    current.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
  );
}
