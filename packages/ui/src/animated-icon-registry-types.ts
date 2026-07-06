import type { ReactNode } from "react";

import type { IconMotion } from "./animated-icon-types";

export type IconDefinition = {
  element: ReactNode;
  motion: IconMotion;
};
