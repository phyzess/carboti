import { useMemo } from "react";
import { ListFrame } from "@carboti/ui";
import { useI18n } from "./i18n";
import { SourceFileItem } from "./review-console-parts";
import type { ImportJobListItem, SourceFile } from "./types";

export function ReviewConsoleSourceList(props: {
  importJobs: ImportJobListItem[];
  sourceFiles: SourceFile[];
}) {
  const { t } = useI18n();
  const jobBySourceId = useMemo(() => {
    return new Map(props.importJobs.map((job) => [job.sourceFileId, job]));
  }, [props.importJobs]);

  return (
    <div className="mt-[var(--qitu-space-s1)]">
      <ListFrame
        description={t("sources.emptyDescription")}
        state={props.sourceFiles.length === 0 ? "empty" : "ready"}
        title={t("sources.emptyTitle")}
      >
        {props.sourceFiles.map((file) => (
          <SourceFileItem file={file} job={jobBySourceId.get(file.id) ?? null} key={file.id} />
        ))}
      </ListFrame>
    </div>
  );
}
