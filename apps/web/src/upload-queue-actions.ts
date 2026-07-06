import type { RefObject } from "react";
import type { UploadQueueEntry } from "./types";
import { runUploadQueueBatch, type UploadQueueBatchOptions } from "./upload-queue-batch";
import { createUploadQueueEntries } from "./upload-queue-state";

export type UploadQueueActionsOptions = UploadQueueBatchOptions & {
  uploadInputRef: RefObject<HTMLInputElement | null>;
  uploadQueue: UploadQueueEntry[];
};

export function createUploadQueueActions(options: UploadQueueActionsOptions) {
  async function handleUploadSelected() {
    const queued = options.uploadQueue.filter((item) => item.status === "queued");
    if (queued.length > 0) {
      await runUploadQueueBatch(options, queued);
      return;
    }

    const selectedFiles = Array.from(options.uploadInputRef.current?.files ?? []);
    if (selectedFiles.length === 0) {
      options.setError(options.t("notice.noFileChosen"));
      return;
    }

    const entries = createUploadQueueEntries(selectedFiles);
    options.setUploadQueue((current) => [...current, ...entries]);
    if (options.uploadInputRef.current) {
      options.uploadInputRef.current.value = "";
    }
    await runUploadQueueBatch(options, entries);
  }

  async function handleUploadSample() {
    const file = new File(["label,value\nSample Record,1.1992\n"], `sample-${Date.now()}.txt`, {
      type: "text/plain",
    });
    const entries = createUploadQueueEntries([file]);
    options.setUploadQueue((current) => [...current, ...entries]);
    await runUploadQueueBatch(options, entries);
  }

  async function retryUploadItem(itemId: string) {
    const item = options.uploadQueue.find((entry) => entry.id === itemId);
    if (!item) return;
    await runUploadQueueBatch(options, [item]);
  }

  function removeUploadItem(itemId: string) {
    options.setUploadQueue((current) => current.filter((item) => item.id !== itemId));
  }

  function resetUploadQueue() {
    options.setUploadQueue([]);
  }

  return {
    handleUploadSample,
    handleUploadSelected,
    removeUploadItem,
    resetUploadQueue,
    retryUploadItem,
  };
}
