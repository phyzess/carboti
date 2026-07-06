import { chartTheme } from "./theme";

export function ChartGrid(props: {
  left: number;
  top: number;
  width: number;
  height: number;
  yValues: number[];
  yScale: (value: number) => number;
}) {
  return (
    <>
      {props.yValues.map((value) => (
        <line
          key={value}
          stroke={chartTheme.grid}
          strokeWidth="1"
          x1={props.left}
          x2={props.left + props.width}
          y1={props.yScale(value)}
          y2={props.yScale(value)}
        />
      ))}
      <rect
        fill="none"
        height={props.height}
        stroke="var(--qitu-line-strong)"
        strokeWidth="1"
        width={props.width}
        x={props.left}
        y={props.top}
      />
    </>
  );
}
