import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";

import { ChartFrame } from "./chart-state";
import { ChartGrid } from "./chart-grid";
import {
  extentOrFallback,
  formatValue,
  normalizeX,
  paddedDomain,
  ticksForDomain,
} from "./chart-utils";
import { chartTheme, toneColor } from "./theme";
import type { ChartDatum, ChartState } from "./types";

export type TimeSeriesChartProps = {
  data: ChartDatum[];
  width?: number | undefined;
  height?: number | undefined;
  color?: string | undefined;
  label?: string | undefined;
  state?: ChartState | undefined;
};

export function TimeSeriesChart({
  color = chartTheme.colors.positive,
  data,
  height = 220,
  label = "Time series",
  state,
  width = 560,
}: TimeSeriesChartProps) {
  const nextState = state ?? (data.length === 0 ? "empty" : "ready");
  if (nextState !== "ready") {
    return <ChartFrame height={height} state={nextState} title={label} />;
  }

  const padding = {
    top: 18,
    right: 18,
    bottom: 30,
    left: 44,
  };
  const innerWidth = Math.max(width - padding.left - padding.right, 1);
  const innerHeight = Math.max(height - padding.top - padding.bottom, 1);
  const points = data.map((datum, index) => ({
    ...datum,
    xValue: normalizeX(datum.x, index),
  }));
  const xValues = points.map((point) => point.xValue);
  const yValues = points.map((point) => point.y);
  const xDomain = extentOrFallback(xValues, [0, 1]);
  const yDomain = paddedDomain(extentOrFallback(yValues, [0, 1]));
  const xScale = scaleLinear({
    domain: xDomain,
    range: [padding.left, padding.left + innerWidth],
  });
  const yScale = scaleLinear({
    domain: yDomain,
    nice: true,
    range: [padding.top + innerHeight, padding.top],
  });
  const lastPoint = points.at(-1);
  const zeroY = yDomain[0] <= 0 && yDomain[1] >= 0 ? yScale(0) : padding.top + innerHeight;

  return (
    <ChartFrame height={height}>
      <svg
        aria-label={label}
        className="qitu-chart"
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
      >
        <ChartGrid
          height={innerHeight}
          left={padding.left}
          top={padding.top}
          width={innerWidth}
          yScale={(value) => yScale(value)}
          yValues={ticksForDomain(yDomain)}
        />
        <line
          stroke={chartTheme.grid}
          strokeWidth="1"
          x1={padding.left}
          x2={padding.left + innerWidth}
          y1={zeroY}
          y2={zeroY}
        />
        <LinePath
          data={points}
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          x={(point) => xScale(point.xValue)}
          y={(point) => yScale(point.y)}
        />
        {points.map((point) => (
          <circle
            cx={xScale(point.xValue)}
            cy={yScale(point.y)}
            fill={point.tone ? toneColor(point.tone) : color}
            key={`${point.xValue}:${point.y}`}
            r="2.75"
            stroke="var(--qitu-surface-2)"
            strokeWidth="2"
          />
        ))}
        {lastPoint ? (
          <text
            className="qitu-number"
            fill={chartTheme.text}
            fontSize="11"
            textAnchor="end"
            x={padding.left + innerWidth}
            y={height - 9}
          >
            {formatValue(lastPoint.y)}
          </text>
        ) : null}
      </svg>
    </ChartFrame>
  );
}
