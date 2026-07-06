import type { ReactNode } from "react";

import { cn } from "./utils";

export function Surface(props: {
  children: ReactNode;
  className?: string | undefined;
  as?: "section" | "article" | "aside" | "div" | undefined;
}) {
  const Component = props.as ?? "section";
  return (
    <Component className={cn("qitu-surface min-w-0", props.className)}>{props.children}</Component>
  );
}
