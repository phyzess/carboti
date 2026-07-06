import type { CSSProperties, ReactNode } from "react";

import type { ChartState } from "./types";

export type ChartFrameProps = {
  children?: ReactNode;
  state?: ChartState | undefined;
  title?: string | undefined;
  description?: string | undefined;
  height?: number | undefined;
  className?: string | undefined;
};

export function ChartFrame({
  children,
  className,
  description,
  height = 220,
  state = "ready",
  title,
}: ChartFrameProps) {
  const style = {
    minHeight: height,
    padding: "var(--qitu-space-s0)",
  } satisfies CSSProperties;

  if (state !== "ready") {
    return (
      <div className={["qitu-surface-subtle", className].filter(Boolean).join(" ")} style={style}>
        <ChartStateView description={description} state={state} title={title} />
      </div>
    );
  }

  return (
    <div className={["qitu-surface-subtle", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}

export function ChartStateView(props: {
  state: Exclude<ChartState, "ready">;
  title?: string | undefined;
  description?: string | undefined;
}) {
  return (
    <div
      style={{
        alignItems: "center",
        color: "var(--qitu-muted)",
        display: "grid",
        minHeight: 160,
        placeItems: "center",
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            color: props.state === "error" ? "var(--qitu-red)" : "var(--qitu-text)",
            fontSize: "var(--qitu-text-label-14)",
            fontWeight: 600,
            lineHeight: "var(--qitu-leading-label-14)",
          }}
        >
          {props.title ?? chartStateTitle(props.state)}
        </div>
        <div
          style={{
            fontSize: "var(--qitu-text-copy-13)",
            lineHeight: "var(--qitu-leading-copy-13)",
            marginTop: "var(--qitu-space-s-3)",
          }}
        >
          {props.description ?? chartStateDescription(props.state)}
        </div>
      </div>
    </div>
  );
}

export function ChartEmptyState(props: {
  title?: string | undefined;
  description?: string | undefined;
}) {
  return <ChartStateView description={props.description} state="empty" title={props.title} />;
}

export function ChartLoadingState(props: {
  title?: string | undefined;
  description?: string | undefined;
}) {
  return <ChartStateView description={props.description} state="loading" title={props.title} />;
}

function chartStateTitle(state: Exclude<ChartState, "ready">): string {
  return {
    empty: "No data",
    error: "Chart unavailable",
    loading: "Loading",
    partial: "Partial data",
  }[state];
}

function chartStateDescription(state: Exclude<ChartState, "ready">): string {
  return {
    empty: "There is not enough source data to render this chart.",
    error: "The data source returned an error.",
    loading: "Waiting for the data source.",
    partial: "Some source data is missing or delayed.",
  }[state];
}
