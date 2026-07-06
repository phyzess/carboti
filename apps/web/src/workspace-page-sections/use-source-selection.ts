import { useCallback, useEffect, useMemo, useState } from "react";
import type { ImportJobListItem, SourceFile } from "../types";

export function useSourceSelection(input: {
  importJobs: ImportJobListItem[];
  sourceFiles: SourceFile[];
}) {
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const jobsBySourceId = useMemo(() => groupJobsBySourceId(input.importJobs), [input.importJobs]);
  const sourceIds = useMemo(
    () => new Set(input.sourceFiles.map((source) => source.id)),
    [input.sourceFiles],
  );
  const selectedSourceIdSet = useMemo(
    () => new Set(selectedSourceIds.filter((id) => sourceIds.has(id))),
    [selectedSourceIds, sourceIds],
  );
  const selectedSource =
    input.sourceFiles.find((source) => source.id === selectedSourceId) ??
    input.sourceFiles[0] ??
    null;
  const selectedSourceJobs = selectedSource ? (jobsBySourceId.get(selectedSource.id) ?? []) : [];

  useEffect(() => {
    setSelectedSourceIds((current) => current.filter((sourceId) => sourceIds.has(sourceId)));
  }, [sourceIds]);

  const clearSourceSelection = useCallback(() => {
    setSelectedSourceIds([]);
  }, []);

  const closeSourceDetails = useCallback(() => {
    setSelectedSourceId(null);
  }, []);

  const toggleSourceSelection = useCallback((sourceId: string, selected: boolean) => {
    setSelectedSourceIds((current) => {
      const next = new Set(current);
      if (selected) {
        next.add(sourceId);
      } else {
        next.delete(sourceId);
      }
      return [...next];
    });
  }, []);

  return {
    clearSourceSelection,
    closeSourceDetails,
    detailsOpen: Boolean(selectedSourceId),
    jobsBySourceId,
    openSourceDetails: setSelectedSourceId,
    selectedSource,
    selectedSourceIdSet,
    selectedSourceJobs,
    toggleSourceSelection,
  };
}

function groupJobsBySourceId(importJobs: ImportJobListItem[]): Map<string, ImportJobListItem[]> {
  const jobsBySourceId = new Map<string, ImportJobListItem[]>();
  for (const job of importJobs) {
    const jobs = jobsBySourceId.get(job.sourceFileId) ?? [];
    jobs.push(job);
    jobsBySourceId.set(job.sourceFileId, jobs);
  }
  return jobsBySourceId;
}
