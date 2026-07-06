import { useRef, useState } from "react";
import type { NoticeDescriptor } from "./app-notice";
import { createUploadQueueEntries } from "./upload-queue-state";
import type { Translate } from "./i18n";
import type { UploadQueueEntry } from "./types";
import { createUploadQueueActions } from "./upload-queue-actions";

type UploadControllerOptions = {
  loadWorkspace: (preferredJobId?: string) => Promise<void>;
  setBusy: (busy: boolean) => void;
  setError: (message: string | null) => void;
  setNotice: (notice: NoticeDescriptor) => void;
  t: Translate;
};

export function useUploadController(options: UploadControllerOptions) {
  const { loadWorkspace, setBusy, setError, setNotice, t } = options;
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueEntry[]>([]);

  function handleUploadFilesSelected(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);
    if (selectedFiles.length === 0) return;

    setUploadQueue((current) => [...current, ...createUploadQueueEntries(selectedFiles)]);
    setNotice({
      key: "notice.filesQueued",
      values: { count: String(selectedFiles.length) },
    });
    if (uploadInputRef.current) {
      uploadInputRef.current.value = "";
    }
  }

  const uploadQueueActions = createUploadQueueActions({
    loadWorkspace,
    setBusy,
    setError,
    setNotice,
    setUploadQueue,
    t,
    uploadInputRef,
    uploadQueue,
  });

  return {
    handleUploadFilesSelected,
    ...uploadQueueActions,
    uploadInputRef,
    uploadQueue,
  };
}
