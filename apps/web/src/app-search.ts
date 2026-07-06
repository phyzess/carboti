import { routePath, type AppNavigationPath } from "./app-routes";
import type { WorkspaceRouteEntry } from "./app-navigation-model";
import type { Translate } from "./i18n";
import type { SearchEntry } from "./shell-controls";
import type { ApiUser, AuditEvent, ImportJobListItem, SourceFile } from "./types";

export function buildSearchEntries(props: {
  auditEvents: AuditEvent[];
  formatBytes: (value: number | null) => string;
  formatStatus: (status: string) => string;
  importJobs: ImportJobListItem[];
  onNavigate: (path: AppNavigationPath) => void;
  onSelectJob: (jobId: string) => void;
  roleLabel: (role: string) => string;
  routeEntries: WorkspaceRouteEntry[];
  sourceFiles: SourceFile[];
  t: Translate;
  user: ApiUser | null;
  users: ApiUser[];
}): SearchEntry[] {
  const entries: SearchEntry[] = props.routeEntries.map((entry) => ({
    description: entry.description,
    group: entry.group,
    id: `route:${entry.path}`,
    label: entry.label,
    onSelect: () => props.onNavigate(entry.path),
  }));

  if (props.user) {
    entries.push({
      description: props.t("search.accountDescription", {
        role: props.roleLabel(props.user.role),
      }),
      group: props.t("nav.account"),
      id: `account:${props.user.id}`,
      label: props.user.email,
      onSelect: () => props.onNavigate(routePath("account")),
    });
  }

  for (const file of props.sourceFiles.slice(0, 8)) {
    entries.push({
      description:
        file.size === null
          ? props.t("search.sourceDescription")
          : props.t("search.sourceDescriptionWithSize", { size: props.formatBytes(file.size) }),
      group: props.t("search.sourcesGroup"),
      id: `source:${file.id}`,
      label: file.filename,
      onSelect: () => props.onNavigate(routePath("sources")),
    });
  }

  for (const job of props.importJobs.slice(0, 8)) {
    entries.push({
      description: props.t("search.importDescription", {
        status: props.formatStatus(job.status),
      }),
      group: props.t("nav.imports"),
      id: `job:${job.id}`,
      label: job.sourceFile.filename,
      onSelect: () => {
        props.onNavigate(routePath("imports"));
        props.onSelectJob(job.id);
      },
    });
  }

  for (const apiUser of props.users.slice(0, 8)) {
    entries.push({
      description: props.t("search.userDescription", {
        role: props.roleLabel(apiUser.role),
      }),
      group: props.t("search.usersGroup"),
      id: `user:${apiUser.id}`,
      label: apiUser.email,
      onSelect: () => props.onNavigate(routePath("users")),
    });
  }

  for (const event of props.auditEvents.slice(0, 8)) {
    entries.push({
      description: `${event.subject.kind}:${event.subject.id}`,
      group: props.t("search.auditGroup"),
      id: `audit:${event.id}`,
      label: event.action,
      onSelect: () => props.onNavigate(routePath("audit")),
    });
  }

  return entries;
}
