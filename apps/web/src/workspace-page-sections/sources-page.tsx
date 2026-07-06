import type { RefObject } from "react";
import { AnimatedIcon, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ImportJobListItem, SourceFile, UploadQueueEntry } from "../types";
import { SourceDetailsDrawer } from "./source-details-drawer";
import { SourceFilesPanel } from "./source-files-panel";
import { SourceUploadPanel } from "./source-upload-panel";
import { Guardrail } from "./page-section-ui";
import { useSourceSelection } from "./use-source-selection";

export function SourcesPage(props: {
  canCommitImports: boolean;
  canDecideReviews: boolean;
  canUploadSources: boolean;
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  onCommitSourceJobs: (jobIds: string[]) => void;
  onConfirmSourceJobs: (jobIds: string[]) => void;
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
  const sourceSelection = useSourceSelection({
    importJobs: props.importJobs,
    sourceFiles: props.sourceFiles,
  });

  return (
    <div className="grid gap-[var(--qitu-layout-gutter)] xl:grid-cols-[minmax(0,1fr)_360px]">
      <Surface className="p-[var(--qitu-space-s1)]">
        <SectionHeader
          description={t("sources.description")}
          icon={<AnimatedIcon name="files" size={16} />}
          title={t("sources.title")}
        />
        <SourceUploadPanel
          canUploadSources={props.canUploadSources}
          isBusy={props.isBusy}
          onRemoveUploadItem={props.onRemoveUploadItem}
          onRetryUploadItem={props.onRetryUploadItem}
          onUploadFilesSelected={props.onUploadFilesSelected}
          onUploadSample={props.onUploadSample}
          onUploadSelected={props.onUploadSelected}
          sourceFileCount={props.sourceFiles.length}
          uploadInputRef={props.uploadInputRef}
          uploadQueue={props.uploadQueue}
        />
        <div className="mt-[var(--qitu-space-s1)]">
          <SourceFilesPanel
            canCommitImports={props.canCommitImports}
            canDecideReviews={props.canDecideReviews}
            importJobs={props.importJobs}
            isBusy={props.isBusy}
            jobsBySourceId={sourceSelection.jobsBySourceId}
            selectedSourceIdSet={sourceSelection.selectedSourceIdSet}
            sourceFiles={props.sourceFiles}
            onClearSelection={sourceSelection.clearSourceSelection}
            onCommitSourceJobs={props.onCommitSourceJobs}
            onConfirmSourceJobs={props.onConfirmSourceJobs}
            onOpenDetails={sourceSelection.openSourceDetails}
            onSelectedChange={sourceSelection.toggleSourceSelection}
          />
        </div>
      </Surface>

      <Surface as="aside" className="p-[var(--qitu-space-s1)]">
        <SectionHeader
          icon={<AnimatedIcon name="audit" size={16} />}
          title={t("review.guardrails")}
        />
        <div className="mt-[var(--qitu-space-s1)] space-y-2">
          <Guardrail label={t("guardrail.loginRequired")} />
          <Guardrail label={t("guardrail.contentHash")} />
          <Guardrail label={t("guardrail.duplicateUpload")} />
          <Guardrail label={t("guardrail.importQueued")} />
        </div>
      </Surface>
      <SourceDetailsDrawer
        file={sourceSelection.selectedSource}
        jobs={sourceSelection.selectedSourceJobs}
        open={sourceSelection.detailsOpen}
        onOpenChange={(open) => {
          if (!open) sourceSelection.closeSourceDetails();
        }}
      />
    </div>
  );
}
