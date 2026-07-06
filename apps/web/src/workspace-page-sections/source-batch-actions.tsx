import { AnimatedIcon, BatchActionBar } from "@carboti/ui";
import { Check } from "lucide-react";
import { useI18n } from "../i18n";
import type { ImportJobListItem } from "../types";

export function SourceBatchActions(props: {
  canCommitImports: boolean;
  canDecideReviews: boolean;
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  onClearSelection: () => void;
  onCommitSourceJobs: (jobIds: string[]) => void;
  onConfirmSourceJobs: (jobIds: string[]) => void;
  selectedSourceIdSet: Set<string>;
}) {
  const { t } = useI18n();
  const selectedPendingJobIds = jobIdsForSources(
    props.importJobs,
    props.selectedSourceIdSet,
    "needs_review",
  );
  const allPendingJobIds = jobIdsByStatus(props.importJobs, "needs_review");
  const selectedConfirmedJobIds = jobIdsForSources(
    props.importJobs,
    props.selectedSourceIdSet,
    "approved",
  );
  const allConfirmedJobIds = jobIdsByStatus(props.importJobs, "approved");
  const selectedCount = props.selectedSourceIdSet.size;

  return (
    <BatchActionBar
      actions={[
        {
          disabled:
            props.isBusy ||
            !props.canDecideReviews ||
            selectedCount === 0 ||
            selectedPendingJobIds.length === 0,
          icon: <Check size={14} />,
          id: "confirm-selected",
          label: t("action.confirmSelectedSources"),
          onSelect: () => props.onConfirmSourceJobs(selectedPendingJobIds),
        },
        {
          disabled: props.isBusy || !props.canDecideReviews || allPendingJobIds.length === 0,
          icon: <Check size={14} />,
          id: "confirm-all",
          label: t("action.confirmAllPendingSources"),
          onSelect: () => props.onConfirmSourceJobs(allPendingJobIds),
          variant: "ghost",
        },
        {
          disabled:
            props.isBusy ||
            !props.canCommitImports ||
            selectedCount === 0 ||
            selectedConfirmedJobIds.length === 0,
          icon: <AnimatedIcon name="database" size={14} />,
          id: "commit-selected",
          label: t("action.commitSelectedSources"),
          onSelect: () => props.onCommitSourceJobs(selectedConfirmedJobIds),
        },
        {
          disabled: props.isBusy || !props.canCommitImports || allConfirmedJobIds.length === 0,
          icon: <AnimatedIcon name="database" size={14} />,
          id: "commit-all",
          label: t("action.commitAllConfirmedSources"),
          onSelect: () => props.onCommitSourceJobs(allConfirmedJobIds),
          variant: "ghost",
        },
      ]}
      clearLabel={t("action.clearSelection")}
      selectedCount={selectedCount}
      summary={t("sources.batchSummary", {
        confirmed: String(allConfirmedJobIds.length),
        pending: String(allPendingJobIds.length),
        selected: String(selectedCount),
      })}
      onClear={props.onClearSelection}
    />
  );
}

function jobIdsForSources(
  jobs: ImportJobListItem[],
  sourceIds: Set<string>,
  status: string,
): string[] {
  if (sourceIds.size === 0) return [];
  return jobs
    .filter((job) => sourceIds.has(job.sourceFileId) && job.status === status)
    .map((job) => job.id);
}

function jobIdsByStatus(jobs: ImportJobListItem[], status: string): string[] {
  return jobs.filter((job) => job.status === status).map((job) => job.id);
}
