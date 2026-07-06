import { scaleLinear } from "@visx/scale";

import { ChartFrame } from "./chart-state";
import { ChartGrid } from "./chart-grid";
import { ticksForDomain, truncateLabel } from "./chart-utils";
import { chartTheme, toneColor } from "./theme";
import type { CategoryDatum, ChartState } from "./types";

export type BarChartProps = {
  data: CategoryDatum[];
  width?: number | undefined;
  height?: number | undefined;
  label?: string | undefined;
  state?: ChartState | undefined;
};

export function BarChart({
  data,
  height = 220,
  label = "Bar chart",
  state,
  width = 560,
}: BarChartProps) {
  const nextState = state ?? (data.length === 0 ? "empty" : "ready");
  if (nextState !== "ready") {
    return <ChartFrame height={height} state={nextState} title={label} />;
  }

  const padding = { top: 18, right: 18, bottom: 36, left: 42 };
  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
  const max = Math.max(...data.map((datum) => datum.value), 1);
  const barWidth = innerWidth / data.length;
  const yScale = scaleLinear({
    domain: [0, max],
    nice: true,
    range: [padding.top + innerHeight, padding.top],
  });

  return (
    <ChartFrame height={height}>
      <svg aria-label={label} role="img" viewBox={`0 0 ${width} ${height}`} width="100%">
        <ChartGrid
          height={innerHeight}
          left={padding.left}
          top={padding.top}
          width={innerWidth}
          yScale={(value) => yScale(value)}
          yValues={ticksForDomain([0, max])}
        />
        {data.map((datum, index) => {
          const x = padding.left + index * barWidth + barWidth * 0.16;
          const y = yScale(datum.value);
          const h = padding.top + innerHeight - y;
          return (
            <g key={datum.label}>
              <rect
                fill={toneColor(datum.tone ?? "info")}
                height={Math.max(h, 1)}
                rx="3"
                width={Math.max(barWidth * 0.68, 4)}
                x={x}
                y={y}
              />
              <text
                fill={chartTheme.text}
                fontSize="10"
                textAnchor="middle"
                x={x + Math.max(barWidth * 0.68, 4) / 2}
                y={height - 12}
              >
                {truncateLabel(datum.label, 9)}
              </text>
            </g>
          );
        })}
      </svg>
    </ChartFrame>
  );
}
