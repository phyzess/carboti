import { scaleLinear } from "@visx/scale";

import { ChartFrame } from "./chart-state";
import { ChartGrid } from "./chart-grid";
import { extentOrFallback, paddedDomain, ticksForDomain } from "./chart-utils";
import { chartToneForIndex, toneColor } from "./theme";
import type { ChartState, ScatterDatum } from "./types";

export type ComparisonScatterChartProps = {
  data: ScatterDatum[];
  width?: number | undefined;
  height?: number | undefined;
  label?: string | undefined;
  state?: ChartState | undefined;
};

export function ComparisonScatterChart({
  data,
  height = 240,
  label = "Comparison scatter",
  state,
  width = 560,
}: ComparisonScatterChartProps) {
  const nextState = state ?? (data.length === 0 ? "empty" : "ready");
  if (nextState !== "ready") {
    return <ChartFrame height={height} state={nextState} title={label} />;
  }

  const padding = { top: 18, right: 18, bottom: 34, left: 42 };
  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
  const xDomain = paddedDomain(
    extentOrFallback(
      data.map((datum) => datum.x),
      [0, 1],
    ),
  );
  const yDomain = paddedDomain(
    extentOrFallback(
      data.map((datum) => datum.y),
      [0, 1],
    ),
  );
  const xScale = scaleLinear({
    domain: xDomain,
    range: [padding.left, padding.left + innerWidth],
  });
  const yScale = scaleLinear({
    domain: yDomain,
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
          yValues={ticksForDomain(yDomain)}
        />
        {data.map((datum, index) => (
          <circle
            cx={xScale(datum.x)}
            cy={yScale(datum.y)}
            fill={toneColor(datum.tone ?? chartToneForIndex(index))}
            key={`${datum.label ?? index}:${datum.x}:${datum.y}`}
            r="4"
            stroke="var(--qitu-surface-2)"
            strokeWidth="2"
          />
        ))}
      </svg>
    </ChartFrame>
  );
}
