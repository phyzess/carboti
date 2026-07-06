import { useMemo } from "react";
import { BarChart, TimeSeriesChart, type CategoryDatum, type ChartDatum } from "@carboti/charts";
import { AnimatedIcon, MetricStrip, StatusBadge, Surface, type MetricItem } from "@carboti/ui";
import { ErrorText } from "./app-ui";
import { useI18n } from "./i18n";
import type { ReviewCounts } from "./review-console-types";
import type { ApiUser } from "./types";

export function ReviewConsoleSummaryPanel(props: {
  counts: ReviewCounts;
  error: string | null;
  notice: string;
  reviewTrend: ChartDatum[];
  user: ApiUser;
}) {
  const { formatStatus, t } = useI18n();
  const metrics: MetricItem[] = useMemo(
    () => [
      {
        id: "pending",
        label: formatStatus("pending"),
        value: props.counts.pending,
        tone: "warning",
      },
      {
        id: "approved",
        label: formatStatus("approved"),
        value: props.counts.approved,
        tone: "positive",
      },
      {
        id: "rejected",
        label: formatStatus("rejected"),
        value: props.counts.rejected,
        tone: "negative",
      },
      { id: "committed", label: formatStatus("committed"), value: props.counts.committed },
    ],
    [formatStatus, props.counts],
  );
  const reviewBars: CategoryDatum[] = useMemo(
    () => [
      { label: formatStatus("pending"), value: props.counts.pending, tone: "warning" },
      { label: formatStatus("approved"), value: props.counts.approved, tone: "positive" },
      { label: formatStatus("rejected"), value: props.counts.rejected, tone: "negative" },
      { label: formatStatus("committed"), value: props.counts.committed, tone: "info" },
    ],
    [formatStatus, props.counts],
  );

  return (
    <Surface className="p-[var(--qitu-space-s1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <StatusBadge tone="active">{props.user.email}</StatusBadge>
          <h1 className="mt-3 truncate text-[length:var(--qitu-text-heading-20)] font-semibold leading-[var(--qitu-leading-heading-20)]">
            {t("review.consoleTitle")}
          </h1>
          <div className="mt-1 text-[length:var(--qitu-text-copy-13)] leading-[var(--qitu-leading-copy-13)] text-[var(--qitu-dim)]">
            {props.notice}
          </div>
        </div>
        <AnimatedIcon
          className="shrink-0 text-[var(--qitu-chroma-lime-ink)]"
          name="key"
          size={17}
        />
      </div>
      {props.error ? <ErrorText>{props.error}</ErrorText> : null}
      <MetricStrip className="mt-[var(--qitu-space-s1)]" items={metrics} />
      <div className="mt-[var(--qitu-space-s1)] grid gap-[var(--qitu-space-s0)]">
        <TimeSeriesChart data={props.reviewTrend} height={132} label={t("review.chartTrend")} />
        <BarChart data={reviewBars} height={156} label={t("review.chartDistribution")} />
      </div>
    </Surface>
  );
}
