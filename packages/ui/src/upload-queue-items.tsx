import { RefreshCcw, X } from "lucide-react";

import { Button } from "./button";
import { StatusBadge, type StatusBadgeTone } from "./status-badge";
import type {
  UploadQueueItem,
  UploadQueueItemStatus,
  UploadQueueProps,
} from "./upload-queue-types";

type UploadQueueRowsProps = Pick<
  UploadQueueProps,
  "labels" | "onRemove" | "onRetry" | "statusLabel"
> & {
  items: UploadQueueItem[];
};

function UploadQueueRows(props: UploadQueueRowsProps) {
  return (
    <div className="grid gap-2">
      {props.items.map((item) => (
        <div className="qitu-upload-row" key={item.id}>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[length:var(--qitu-text-label-14)] font-medium leading-[var(--qitu-leading-label-14)]">
              {item.name}
            </div>
            {item.error ? (
              <div className="mt-1 truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-red)]">
                {item.error}
              </div>
            ) : item.meta ? (
              <div className="qitu-number mt-1 truncate text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
                {item.meta}
              </div>
            ) : null}
          </div>
          <StatusBadge tone={uploadStatusTone(item.status)}>
            {props.statusLabel(item.status)}
          </StatusBadge>
          {item.status === "failed" && props.onRetry ? (
            <Button
              aria-label={`${props.labels.retry} ${item.name}`}
              className="size-8 px-0"
              size="sm"
              title={props.labels.retry}
              variant="ghost"
              onClick={() => props.onRetry?.(item.id)}
            >
              <RefreshCcw aria-hidden="true" size={14} />
            </Button>
          ) : null}
          {props.onRemove ? (
            <Button
              aria-label={`${props.labels.remove} ${item.name}`}
              className="size-8 px-0"
              disabled={item.status === "uploading"}
              size="sm"
              title={props.labels.remove}
              variant="ghost"
              onClick={() => props.onRemove?.(item.id)}
            >
              <X aria-hidden="true" size={14} />
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function uploadStatusTone(status: UploadQueueItemStatus): StatusBadgeTone {
  if (status === "uploaded" || status === "duplicate") return "success";
  if (status === "failed") return "danger";
  if (status === "uploading") return "active";
  return "warning";
}

export { UploadQueueRows };
