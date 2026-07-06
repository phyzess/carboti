import { AnimatedIcon, Button, ListFrame, SectionHeader, Surface } from "@carboti/ui";
import { useI18n } from "./i18n";
import { JobStep, PermissionHint } from "./review-console-parts";
import type { ImportJobListItem } from "./types";

export function ReviewConsoleImportJobsPanel(props: {
  canProcessImports: boolean;
  importJobs: ImportJobListItem[];
  isBusy: boolean;
  onProcessLocalQueue: () => void;
  onSelectJob: (jobId: string) => void;
  runtimeEnvironment: string;
  selectedJobId: string | null;
}) {
  const { t } = useI18n();

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <SectionHeader
        action={
          props.runtimeEnvironment === "local" ? (
            <Button
              disabled={props.isBusy || !props.canProcessImports}
              size="sm"
              variant="ghost"
              onClick={props.onProcessLocalQueue}
            >
              <AnimatedIcon name="refresh" size={14} /> {t("action.processLocalQueue")}
            </Button>
          ) : null
        }
        icon={<AnimatedIcon name="activity" size={16} />}
        title={t("imports.title")}
      />
      <div className="mt-[var(--qitu-space-s1)]">
        <ListFrame
          description={t("imports.emptyDescription")}
          state={props.importJobs.length === 0 ? "empty" : "ready"}
          title={t("imports.emptyTitle")}
        >
          {props.importJobs.map((job) => (
            <JobStep
              active={job.id === props.selectedJobId}
              job={job}
              key={job.id}
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
