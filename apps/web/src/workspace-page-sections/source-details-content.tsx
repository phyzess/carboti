import { DataState, SectionHeader, StatusBadge } from "@carboti/ui";
import { RuntimeRow } from "../app-ui";
import { useI18n } from "../i18n";
import type { ImportJobListItem, SourceFile } from "../types";
import { statusTone } from "./status-tone";

export function SourceDetailsContent(props: { file: SourceFile; jobs: ImportJobListItem[] }) {
  const { formatBytes, formatDateTime, t } = useI18n();

  return (
    <div>
      <div className="mt-[var(--qitu-space-s1)] grid gap-2">
        <RuntimeRow label={t("sources.uploadedAt")} value={formatDateTime(props.file.uploadedAt)} />
        <RuntimeRow label={t("sources.fileSize")} value={formatBytes(props.file.size)} />
        <RuntimeRow label={t("sources.contentTypeLabel")} value={props.file.contentType} />
        <RuntimeRow
          label={t("sources.contentHashLabel")}
          value={props.file.contentHash ?? t("common.none")}
        />
        <RuntimeRow label={t("sources.objectKey")} value={props.file.objectKey} />
      </div>

      <div className="mt-[var(--qitu-space-s1)]">
        <SectionHeader title={t("sources.importJobs")} />
        <div className="mt-3 grid gap-2">
          {props.jobs.length === 0 ? (
            <DataState
              description={t("sources.noImportJob")}
              state="empty"
              title={t("sources.noImportJobsTitle")}
            />
          ) : (
            props.jobs.map((job) => <SourceImportJobRow job={job} key={job.id} />)
          )}
        </div>
      </div>
    </div>
  );
}

function SourceImportJobRow(props: { job: ImportJobListItem }) {
  const { formatDateTime, formatStatus } = useI18n();

  return (
    <div className="qitu-surface-subtle p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="qitu-number truncate text-[length:var(--qitu-text-label-13)] font-medium leading-[var(--qitu-leading-label-13)]">
            {props.job.id}
          </div>
          <div className="qitu-number mt-1 text-[length:var(--qitu-text-label-12)] leading-[var(--qitu-leading-label-12)] text-[var(--qitu-dim)]">
            {formatDateTime(props.job.updatedAt)}
          </div>
        </div>
        <StatusBadge tone={statusTone(props.job.status)}>
          {formatStatus(props.job.status)}
        </StatusBadge>
      </div>
    </div>
  );
}
