import type { DragEvent } from "react";

import { cn } from "./utils";
import { UploadQueueCompactEmpty, UploadQueueEmpty } from "./upload-queue-empty";
import { UploadQueueRows } from "./upload-queue-items";
import type { UploadQueueProps } from "./upload-queue-types";

export function UploadQueue(props: UploadQueueProps) {
  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (!props.onFilesDrop) return;
    event.preventDefault();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    if (!props.onFilesDrop) return;
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      props.onFilesDrop(event.dataTransfer.files);
    }
  }

  const isEmpty = props.items.length === 0;

  return (
    <div
      className={cn("qitu-upload-dropzone", props.className)}
      data-compact={props.compact && isEmpty ? "true" : undefined}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {isEmpty && props.compact ? (
        <UploadQueueCompactEmpty {...props} />
      ) : isEmpty ? (
        <UploadQueueEmpty {...props} />
      ) : (
        <UploadQueueRows {...props} />
      )}
    </div>
  );
}
