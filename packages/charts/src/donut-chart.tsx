import { ChartFrame } from "./chart-state";
import { formatValue } from "./chart-utils";
import { donutArcPath } from "./donut-geometry";
import { chartTheme, chartToneForIndex, toneColor } from "./theme";
import type { CategoryDatum, ChartState } from "./types";

export type DonutChartProps = {
  data: CategoryDatum[];
  width?: number | undefined;
  height?: number | undefined;
  label?: string | undefined;
  state?: ChartState | undefined;
};

export function DonutChart({
  data,
  height = 220,
  label = "Donut chart",
  state,
  width = 320,
}: DonutChartProps) {
  const nextState = state ?? (data.length === 0 ? "empty" : "ready");
  if (nextState !== "ready") {
    return <ChartFrame height={height} state={nextState} title={label} />;
  }

  const total = data.reduce((sum, datum) => sum + Math.max(datum.value, 0), 0);
  if (total === 0) {
    return <ChartFrame height={height} state="empty" title={label} />;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.34;
  const strokeWidth = Math.max(radius * 0.26, 12);
  let current = -90;

  return (
    <ChartFrame height={height}>
      <svg aria-label={label} role="img" viewBox={`0 0 ${width} ${height}`} width="100%">
        <circle
          cx={centerX}
          cy={centerY}
          fill="none"
          r={radius}
          stroke="var(--qitu-line)"
          strokeWidth={strokeWidth}
        />
        {data.map((datum, index) => {
          const sweep = (Math.max(datum.value, 0) / total) * 360;
          const start = current;
          const end = current + sweep;
          current = end;
          return (
            <path
              d={donutArcPath(centerX, centerY, radius, start, end)}
              fill="none"
              key={datum.label}
              stroke={toneColor(datum.tone ?? chartToneForIndex(index))}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            />
          );
        })}
        <text
          className="qitu-number"
          fill="var(--qitu-text)"
          fontSize="18"
          fontWeight="600"
          textAnchor="middle"
          x={centerX}
          y={centerY - 2}
        >
          {formatValue(total)}
        </text>
        <text fill={chartTheme.text} fontSize="11" textAnchor="middle" x={centerX} y={centerY + 18}>
          total
        </text>
      </svg>
    </ChartFrame>
  );
}
