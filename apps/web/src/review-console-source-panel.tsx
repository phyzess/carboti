import type { RefObject } from "react";
import { AnimatedIcon, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "./i18n";
import { ReviewConsoleSourceList } from "./review-console-source-list";
import { ReviewConsoleUploadQueue } from "./review-console-upload-queue";
import type { ImportJobListItem, SourceFile, UploadQueueEntry } from "./types";

export function ReviewConsoleSourcePanel(props: {
  canUploadSources: boolean;
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  onRemoveUploadItem: (itemId: string) => void;
  onRetryUploadItem: (itemId: string) => void;
  onUploadFilesSelected: (files: FileList | null) => void;
  onUploadSample: () => void;
  onUploadSelected: () => void;
  sourceFiles: SourceFile[];
  uploadInputRef: RefObject<HTMLInputElement | null>;
  uploadQueue: UploadQueueEntry[];
}) {
  const { t } = useI18n();
  const compactUpload = props.sourceFiles.length > 0 && props.uploadQueue.length === 0;

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        description={t("sources.description")}
        icon={<AnimatedIcon name="files" size={16} />}
        title={t("sources.title")}
      />
      <ReviewConsoleUploadQueue
        canUploadSources={props.canUploadSources}
        compact={compactUpload}
        inputRef={props.uploadInputRef}
        isBusy={props.isBusy}
        onFilesSelected={props.onUploadFilesSelected}
        onRemoveItem={props.onRemoveUploadItem}
        onRetryItem={props.onRetryUploadItem}
        onUploadSample={props.onUploadSample}
        onUploadSelected={props.onUploadSelected}
        queue={props.uploadQueue}
      />
      <ReviewConsoleSourceList importJobs={props.importJobs} sourceFiles={props.sourceFiles} />
    </Surface>
  );
}
