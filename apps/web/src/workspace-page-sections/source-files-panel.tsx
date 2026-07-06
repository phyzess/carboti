import { ListFrame } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ImportJobListItem, SourceFile } from "../types";
import { SourceBatchActions } from "./source-batch-actions";
import { SourceFileRow } from "./source-file-row";

export function SourceFilesPanel(props: {
  canCommitImports: boolean;
  canDecideReviews: boolean;
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  jobsBySourceId: Map<string, ImportJobListItem[]>;
  onClearSelection: () => void;
  onCommitSourceJobs: (jobIds: string[]) => void;
  onConfirmSourceJobs: (jobIds: string[]) => void;
  onOpenDetails: (sourceId: string) => void;
  onSelectedChange: (sourceId: string, selected: boolean) => void;
  selectedSourceIdSet: Set<string>;
  sourceFiles: SourceFile[];
}) {
  const { t } = useI18n();

  return (
    <ListFrame
      description={t("sources.emptyDescription")}
      state={props.sourceFiles.length === 0 ? "empty" : "ready"}
      title={t("sources.emptyTitle")}
    >
      <SourceBatchActions
        canCommitImports={props.canCommitImports}
        canDecideReviews={props.canDecideReviews}
        importJobs={props.importJobs}
        isBusy={props.isBusy}
        selectedSourceIdSet={props.selectedSourceIdSet}
        onClearSelection={props.onClearSelection}
        onCommitSourceJobs={props.onCommitSourceJobs}
        onConfirmSourceJobs={props.onConfirmSourceJobs}
      />
      {props.sourceFiles.map((file) => (
        <SourceFileRow
          file={file}
          jobs={props.jobsBySourceId.get(file.id) ?? []}
          key={file.id}
          selected={props.selectedSourceIdSet.has(file.id)}
          onOpenDetails={() => props.onOpenDetails(file.id)}
          onSelectedChange={(selected) => props.onSelectedChange(file.id, selected)}
        />
      ))}
    </ListFrame>
  );
}
