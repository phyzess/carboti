import type { RefObject } from "react";
import { Input, UploadQueue } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { UploadQueueEntry } from "../types";
import { PermissionHint } from "./page-section-ui";
import { SourceCompactUploadActions, SourceUploadActions } from "./source-upload-actions";
import { sourceUploadQueueItems } from "./source-upload-queue-items";

export function SourceUploadPanel(props: {
  canUploadSources: boolean;
  isBusy: boolean;
  onRemoveUploadItem: (itemId: string) => void;
  onRetryUploadItem: (itemId: string) => void;
  onUploadFilesSelected: (files: FileList | null) => void;
  onUploadSample: () => void;
  onUploadSelected: () => void;
  sourceFileCount: number;
  uploadInputRef: RefObject<HTMLInputElement | null>;
  uploadQueue: UploadQueueEntry[];
}) {
  const { formatBytes, formatStatus, t } = useI18n();
  const compactUpload = props.sourceFileCount > 0 && props.uploadQueue.length === 0;
  const chooseFiles = () => props.uploadInputRef.current?.click();

  return (
    <>
      <div className="mt-[var(--qitu-space-s1)] grid gap-3">
        <Input
          className="hidden"
          disabled={!props.canUploadSources}
          multiple
          ref={props.uploadInputRef}
          type="file"
          onChange={(event) => props.onUploadFilesSelected(event.currentTarget.files)}
        />
        <UploadQueue
          compact={compactUpload}
          compactAction={
            compactUpload ? (
              <SourceCompactUploadActions
                canUploadSources={props.canUploadSources}
                isBusy={props.isBusy}
                onChooseFiles={chooseFiles}
                onUploadSample={props.onUploadSample}
              />
            ) : null
          }
          compactDescription={t("sources.compactUploadDescription")}
          compactTitle={t("sources.compactUploadTitle")}
          emptyDescription={t("sources.uploadQueueEmptyDescription")}
          emptyTitle={t("sources.uploadQueueEmptyTitle")}
          items={sourceUploadQueueItems(props.uploadQueue, formatBytes)}
          labels={{
            remove: t("action.removeUpload"),
            retry: t("action.retryUpload"),
          }}
          statusLabel={formatStatus}
          onFilesDrop={props.canUploadSources ? props.onUploadFilesSelected : undefined}
          onRemove={props.onRemoveUploadItem}
          onRetry={props.onRetryUploadItem}
        />
        <SourceUploadActions
          canUploadSources={props.canUploadSources}
          hidden={compactUpload}
          isBusy={props.isBusy}
          onChooseFiles={chooseFiles}
          onUploadSample={props.onUploadSample}
          onUploadSelected={props.onUploadSelected}
        />
      </div>
      {!props.canUploadSources ? (
        <div className="mt-3">
          <PermissionHint label={t("permission.sourceUpload")} />
        </div>
      ) : null}
    </>
  );
}
