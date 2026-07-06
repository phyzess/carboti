import type { RefObject } from "react";
import { Button, Input, UploadQueue } from "@carboti/ui";
import { FileUp } from "lucide-react";
import { useI18n } from "./i18n";
import { uploadQueueItems } from "./review-console-helpers";
import { PermissionHint } from "./review-console-parts";
import type { UploadQueueEntry } from "./types";

export function ReviewConsoleUploadQueue(props: {
  canUploadSources: boolean;
  compact: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  isBusy: boolean;
  onFilesSelected: (files: FileList | null) => void;
  onRemoveItem: (itemId: string) => void;
  onRetryItem: (itemId: string) => void;
  onUploadSample: () => void;
  onUploadSelected: () => void;
  queue: UploadQueueEntry[];
}) {
  const { formatBytes, formatStatus, t } = useI18n();

  return (
    <>
      <div className="mt-[var(--qitu-space-s1)] space-y-3">
        <Input
          className="hidden"
          disabled={!props.canUploadSources}
          multiple
          ref={props.inputRef}
          type="file"
          onChange={(event) => props.onFilesSelected(event.currentTarget.files)}
        />
        <UploadQueue
          compact={props.compact}
          compactAction={
            props.compact ? (
              <>
                <Button
                  disabled={props.isBusy || !props.canUploadSources}
                  size="sm"
                  type="button"
                  variant="secondary"
                  onClick={() => props.inputRef.current?.click()}
                >
                  <FileUp size={14} /> {t("action.chooseFiles")}
                </Button>
                <Button
                  disabled={props.isBusy || !props.canUploadSources}
                  size="sm"
                  type="button"
                  variant="ghost"
                  onClick={props.onUploadSample}
                >
                  <FileUp size={14} /> {t("action.uploadSample")}
                </Button>
              </>
            ) : null
          }
          compactDescription={t("sources.compactUploadDescription")}
          compactTitle={t("sources.compactUploadTitle")}
          emptyDescription={t("sources.uploadQueueEmptyDescription")}
          emptyTitle={t("sources.uploadQueueEmptyTitle")}
          items={uploadQueueItems(props.queue, formatBytes)}
          labels={{
            remove: t("action.removeUpload"),
            retry: t("action.retryUpload"),
          }}
          statusLabel={formatStatus}
          onFilesDrop={props.canUploadSources ? props.onFilesSelected : undefined}
          onRemove={props.onRemoveItem}
          onRetry={props.onRetryItem}
        />
        <div className={props.compact ? "hidden" : "flex flex-wrap gap-2"}>
          <Button
            disabled={props.isBusy || !props.canUploadSources}
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => props.inputRef.current?.click()}
          >
            <FileUp size={14} /> {t("action.chooseFiles")}
          </Button>
          <Button
            disabled={props.isBusy || !props.canUploadSources}
            size="sm"
            variant="secondary"
            onClick={props.onUploadSelected}
          >
            <FileUp size={14} /> {t("action.uploadSelected")}
          </Button>
          <Button
            disabled={props.isBusy || !props.canUploadSources}
            size="sm"
            variant="ghost"
            onClick={props.onUploadSample}
          >
            <FileUp size={14} /> {t("action.uploadSample")}
          </Button>
        </div>
      </div>
      {!props.canUploadSources ? (
        <div className="mt-3">
          <PermissionHint label={t("permission.sourceUpload")} />
        </div>
      ) : null}
    </>
  );
}
