import { AnimatedIcon, MetricStrip, SectionHeader, Surface, type MetricItem } from "@carboti/ui";
import { routePath, type AppNavigationPath } from "../app-routes";
import { useI18n } from "../i18n";
import type { ImportJobListItem, SourceFile } from "../types";
import { latestTime } from "./overview-page-helpers";
import { WorkflowTarget } from "./page-section-ui";

type WorkspaceReviewCounts = {
  approvedForCommit: number;
  failed: number;
  reviewQueue: number;
};

export type WorkspaceHomeProps = {
  importJobs: ImportJobListItem[];
  onNavigate: (path: AppNavigationPath) => void;
  sourceFiles: SourceFile[];
  workspaceReviewCounts: WorkspaceReviewCounts;
};

export function OverviewPage(props: WorkspaceHomeProps) {
  const { formatDateTime, t } = useI18n();
  const metrics: MetricItem[] = [
    {
      id: "sources",
      label: t("overview.metricSourceFiles"),
      value: props.sourceFiles.length,
      meta: latestTime(
        props.sourceFiles.map((file) => file.uploadedAt),
        formatDateTime,
        t,
      ),
    },
    {
      id: "imports",
      label: t("overview.metricImportJobs"),
      value: props.importJobs.length,
      meta: latestTime(
        props.importJobs.map((job) => job.updatedAt),
        formatDateTime,
        t,
      ),
    },
    {
      id: "pending",
      label: t("overview.metricReviewQueue"),
      value: props.workspaceReviewCounts.reviewQueue,
      tone: props.workspaceReviewCounts.reviewQueue > 0 ? "warning" : "neutral",
      meta:
        props.workspaceReviewCounts.approvedForCommit > 0
          ? t("overview.metricApprovedForCommit", {
              count: props.workspaceReviewCounts.approvedForCommit,
            })
          : undefined,
    },
  ];

  return (
    <div className="space-y-[var(--qitu-layout-gutter)]">
      <Surface className="p-[var(--qitu-space-s1)]">
        <SectionHeader
          description={t("overview.description")}
          icon={<AnimatedIcon name="workbench" size={16} />}
          title={t("overview.title")}
        />
      </Surface>

      <Surface className="p-[var(--qitu-space-s1)]">
        <MetricStrip items={metrics} />
      </Surface>

      <Surface className="p-[var(--qitu-space-s1)]">
        <SectionHeader
          icon={<AnimatedIcon name="reviews" size={16} />}
          title={t("overview.workflowTitle")}
        />
        <div className="mt-[var(--qitu-space-s1)] grid gap-3 md:grid-cols-3">
          <WorkflowTarget
            description={t("overview.workflowSourcesDescription")}
            icon={<AnimatedIcon name="files" size={16} />}
            label={t("nav.sources")}
            onClick={() => props.onNavigate(routePath("sources"))}
            status={t("overview.workflowSourcesStatus", { count: props.sourceFiles.length })}
          />
          <WorkflowTarget
            description={t("overview.workflowImportsDescription")}
            icon={<AnimatedIcon name="database" size={16} />}
            label={t("nav.imports")}
            onClick={() => props.onNavigate(routePath("imports"))}
            status={t("overview.workflowImportsStatus", { count: props.importJobs.length })}
          />
          <WorkflowTarget
            description={t("overview.workflowReviewsDescription")}
            icon={<AnimatedIcon name="reviews" size={16} />}
            label={t("nav.reviews")}
            onClick={() => props.onNavigate(routePath("reviews"))}
            status={t("overview.workflowReviewsStatus", {
              count: props.workspaceReviewCounts.reviewQueue,
            })}
          />
        </div>
      </Surface>
    </div>
  );
}
