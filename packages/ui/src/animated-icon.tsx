import type { CSSProperties } from "react";

import { iconRegistry } from "./animated-icon-registry";
import type { AnimatedIconProps } from "./animated-icon-types";
import { cn } from "./utils";

export { type AnimatedIconName, type AnimatedIconProps } from "./animated-icon-types";

export function AnimatedIcon({ className, name, size = 16, title }: AnimatedIconProps) {
  const icon = iconRegistry[name];
  const style: CSSProperties = {
    height: size,
    width: size,
  };

  return (
    <span
      aria-hidden={title ? undefined : "true"}
      aria-label={title}
      className={cn("qitu-animated-icon", className)}
      data-icon={name}
      data-motion={icon.motion}
      role={title ? "img" : undefined}
      style={style}
    >
      <svg
        aria-hidden="true"
        className="qitu-animated-icon-svg"
        fill="none"
        focusable="false"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        {icon.element}
      </svg>
    </span>
  );
}
