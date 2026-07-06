import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

type TableScrollAreaVariant = "bounded" | "compact" | "free";

type TableScrollAreaProps = React.ComponentProps<"div"> & {
  maxHeight?: string | undefined;
  variant?: TableScrollAreaVariant | undefined;
};

function TableScrollArea({
  className,
  maxHeight,
  style,
  variant = "bounded",
  ...props
}: TableScrollAreaProps) {
  const resolvedStyle = maxHeight ? { ...style, maxHeight } : style;

  return (
    <div
      data-slot="table-scroll-area"
      data-variant={variant}
      style={resolvedStyle}
      className={cn("qitu-table-scroll-area", className)}
      {...props}
    />
  );
}

export { Table, TableScrollArea, type TableScrollAreaProps, type TableScrollAreaVariant };
