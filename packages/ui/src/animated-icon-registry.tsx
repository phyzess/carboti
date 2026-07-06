import type { AnimatedIconName } from "./animated-icon-types";
import { shellIconRegistry } from "./animated-icon-registry-shell";
import type { IconDefinition } from "./animated-icon-registry-types";
import { workflowIconRegistry } from "./animated-icon-registry-workflow";

// SVG source is adapted from @animateicons/react/lucide v0.3.4 (MIT).
// Runtime motion is implemented locally so qitu ships only the selected icons.
export const iconRegistry = {
  ...shellIconRegistry,
  ...workflowIconRegistry,
} satisfies Record<AnimatedIconName, IconDefinition>;
