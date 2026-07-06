import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function CalendarRoot({
  className,
  rootRef,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  rootRef?: React.Ref<HTMLDivElement>;
}) {
  return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
}

function CalendarChevron({
  className,
  orientation,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  orientation?: "up" | "down" | "left" | "right";
}) {
  if (orientation === "left") {
    return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
  }

  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
  }

  return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
}

function CalendarWeekNumber({ children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </td>
  );
}

export { CalendarRoot, CalendarChevron, CalendarWeekNumber };
