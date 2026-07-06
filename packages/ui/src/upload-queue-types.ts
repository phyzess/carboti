import type { ReactNode } from "react";

export type UploadQueueItemStatus = "queued" | "uploading" | "uploaded" | "duplicate" | "failed";

export type UploadQueueItem = {
  error?: string | undefined;
  id: string;
  meta?: ReactNode | undefined;
  name: string;
  status: UploadQueueItemStatus;
};

export type UploadQueueProps = {
  className?: string | undefined;
  compact?: boolean | undefined;
  compactAction?: ReactNode | undefined;
  compactDescription?: ReactNode | undefined;
  compactTitle?: ReactNode | undefined;
  emptyDescription: string;
  emptyTitle: string;
  items: UploadQueueItem[];
  labels: {
    remove: string;
    retry: string;
  };
  onFilesDrop?: ((files: FileList) => void) | undefined;
  onRemove?: ((itemId: string) => void) | undefined;
  onRetry?: ((itemId: string) => void) | undefined;
  statusLabel: (status: UploadQueueItemStatus) => string;
};
