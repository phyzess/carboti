import { FileUp } from "lucide-react";

import type { UploadQueueProps } from "./upload-queue-types";

type UploadQueueEmptyProps = Pick<
  UploadQueueProps,
  "compactAction" | "compactDescription" | "compactTitle" | "emptyDescription" | "emptyTitle"
>;

function UploadQueueCompactEmpty(props: UploadQueueEmptyProps) {
  return (
    <div className="qitu-upload-compact">
      <div className="qitu-icon-chip size-9">
        <FileUp aria-hidden="true" size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
          {props.compactTitle ?? props.emptyTitle}
        </div>
        <div className="mt-1 truncate text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
          {props.compactDescription ?? props.emptyDescription}
        </div>
      </div>
      {props.compactAction ? (
        <div className="qitu-upload-compact-actions">{props.compactAction}</div>
      ) : null}
    </div>
  );
}

function UploadQueueEmpty(props: UploadQueueEmptyProps) {
  return (
    <div className="qitu-upload-empty">
      <div className="qitu-icon-chip mx-auto size-9">
        <FileUp aria-hidden="true" size={16} />
      </div>
      <div className="mt-3 text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
        {props.emptyTitle}
      </div>
      <div className="mt-1 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-muted)]">
        {props.emptyDescription}
      </div>
    </div>
  );
}

export { UploadQueueCompactEmpty, UploadQueueEmpty };
