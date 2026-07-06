import { AnimatedIcon, Button, ListFrame, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "../i18n";
import type { ImportJobListItem } from "../types";
import { ImportJobRow } from "./import-job-row";
import { PermissionHint } from "./page-section-ui";

export function ImportJobsPanel(props: {
  canProcessImports: boolean;
  canRetry: boolean;
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  onOpenReview: (jobId: string) => void;
  onProcessLocalQueue: () => void;
  onRetrySelectedJob: () => void;
  onSelectJob: (jobId: string) => void;
  retryAvailable: boolean;
  runtimeEnvironment: string;
  selectedJobId: string | null;
}) {
  const { t } = useI18n();

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        action={
          <div className="flex flex-wrap gap-2">
            {props.runtimeEnvironment === "local" ? (
              <Button
                disabled={props.isBusy || !props.canProcessImports}
                size="sm"
                variant="ghost"
                onClick={props.onProcessLocalQueue}
              >
                <AnimatedIcon name="refresh" size={14} /> {t("action.processLocalQueue")}
              </Button>
            ) : null}
            {props.retryAvailable ? (
              <Button
                disabled={props.isBusy || !props.canRetry}
                size="sm"
                variant="secondary"
                onClick={props.onRetrySelectedJob}
              >
                <AnimatedIcon name="refresh" size={14} /> {t("action.retryJob")}
              </Button>
            ) : null}
          </div>
        }
        icon={<AnimatedIcon name="database" size={16} />}
        title={t("imports.title")}
      />
      <div className="mt-[var(--qitu-space-s1)]">
        <ListFrame
          description={t("imports.emptyDescription")}
          state={props.importJobs.length === 0 ? "empty" : "ready"}
          title={t("imports.emptyTitle")}
        >
          {props.importJobs.map((job) => (
            <ImportJobRow
              active={job.id === props.selectedJobId}
              job={job}
              key={job.id}
              onOpenReview={() => props.onOpenReview(job.id)}
              onSelect={() => props.onSelectJob(job.id)}
            />
          ))}
        </ListFrame>
        {!props.canProcessImports ? (
          <div className="mt-3">
            <PermissionHint label={t("permission.importProcess")} />
          </div>
        ) : null}
      </div>
    </Surface>
  );
}
