import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import { cn } from "./utils";

export type SegmentedControlItem<TValue extends string> = {
  disabled?: boolean | undefined;
  icon?: ReactNode | undefined;
  label: ReactNode;
  value: TValue;
};

export function SegmentedControl<TValue extends string>(props: {
  "aria-label"?: string | undefined;
  className?: string | undefined;
  items: Array<SegmentedControlItem<TValue>>;
  onValueChange: (value: TValue) => void;
  value: TValue;
}) {
  return (
    <Tabs
      className={cn("qitu-segmented-control", props.className)}
      value={props.value}
      onValueChange={(value) => props.onValueChange(value as TValue)}
    >
      <TabsList aria-label={props["aria-label"]} className="qitu-segment-track grid gap-2">
        {props.items.map((item) => (
          <TabsTrigger
            className="qitu-segment-tab"
            disabled={item.disabled}
            key={item.value}
            value={item.value}
          >
            {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
            <span className="min-w-0 truncate">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
