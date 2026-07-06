import { useMemo } from "react";
import type { AppNavigationModel } from "./app-navigation";
import type { AppNavigationPath } from "./app-routes";
import { buildSearchEntries } from "./app-search";
import type { useI18n } from "./i18n";
import type { ApiUser, AuditEvent, ImportJobListItem, SourceFile } from "./types";
import type { SearchEntry } from "./workspace-search-types";

type WorkspaceShellSearchFormatters = Pick<
  ReturnType<typeof useI18n>,
  "formatBytes" | "formatStatus" | "roleLabel" | "t"
>;

export function useWorkspaceShellSearchEntries(options: {
  auditEvents: AuditEvent[];
  formatters: WorkspaceShellSearchFormatters;
  importJobs: ImportJobListItem[];
  navigate: (path: AppNavigationPath, options?: { replace?: boolean }) => void;
  navigationModel: AppNavigationModel;
  onSelectJob: (jobId: string) => void;
  sourceFiles: SourceFile[];
  user: ApiUser | null;
  users: ApiUser[];
}): SearchEntry[] {
  const {
    auditEvents,
    formatters,
    importJobs,
    navigate,
    navigationModel,
    onSelectJob,
    sourceFiles,
    user,
    users,
  } = options;
  const { formatBytes, formatStatus, roleLabel, t } = formatters;

  return useMemo(
    () =>
      buildSearchEntries({
        auditEvents,
        formatBytes,
        formatStatus,
        importJobs,
        onNavigate: (path) => navigate(path),
        onSelectJob: (jobId) => onSelectJob(jobId),
        roleLabel,
        routeEntries: navigationModel.routeEntries,
        sourceFiles,
        t,
        user,
        users,
      }),
    [
      auditEvents,
      formatBytes,
      formatStatus,
      importJobs,
      navigate,
      navigationModel.routeEntries,
      onSelectJob,
      roleLabel,
      sourceFiles,
      t,
      user,
      users,
    ],
  );
}
