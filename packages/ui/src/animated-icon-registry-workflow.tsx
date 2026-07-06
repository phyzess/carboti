import type { AnimatedIconName } from "./animated-icon-types";
import type { IconDefinition } from "./animated-icon-registry-types";

type WorkflowIconName = Extract<
  AnimatedIconName,
  | "activity"
  | "audit"
  | "database"
  | "files"
  | "intake"
  | "key"
  | "operations"
  | "refresh"
  | "reviews"
  | "sparkles"
>;

export const workflowIconRegistry = {
  activity: {
    motion: "activity",
    element: (
      <path
        className="qitu-icon-primary"
        d="M2 12h2.49a2 2 0 0 0 1.92-1.46l2.35-8.36a.25.25 0 0 1 .48 0l5.52 19.64a.25.25 0 0 0 .48 0l2.35-8.36A2 2 0 0 1 19.52 12H22"
      />
    ),
  },
  audit: {
    motion: "shield",
    element: (
      <>
        <path
          className="qitu-icon-primary"
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        />
        <path className="qitu-icon-check" d="m9 12 2 2 4-4" />
      </>
    ),
  },
  database: {
    motion: "boxes",
    element: (
      <>
        <g className="qitu-icon-box qitu-icon-box-left">
          <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
          <path d="m7 16.5-4.74-2.85" />
          <path d="m7 16.5 5-3" />
          <path d="M7 16.5v5.17" />
        </g>
        <g className="qitu-icon-box qitu-icon-box-right">
          <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
          <path d="m17 16.5-5-3" />
          <path d="m17 16.5 4.74-2.85" />
          <path d="M17 16.5v5.17" />
        </g>
        <g className="qitu-icon-box qitu-icon-box-top">
          <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
          <path d="M12 8 7.26 5.15" />
          <path d="m12 8 4.74-2.85" />
          <path d="M12 13.5V8" />
        </g>
      </>
    ),
  },
  files: {
    motion: "folder",
    element: (
      <path
        className="qitu-icon-primary"
        d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
      />
    ),
  },
  intake: {
    motion: "upload",
    element: (
      <>
        <g className="qitu-icon-arrow">
          <path d="M12 3v12" />
          <path d="m17 8-5-5-5 5" />
        </g>
        <path className="qitu-icon-secondary" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      </>
    ),
  },
  key: {
    motion: "key",
    element: (
      <>
        <path
          className="qitu-icon-primary"
          d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
        />
        <circle
          className="qitu-icon-dot"
          cx="16.5"
          cy="7.5"
          r="0.5"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  },
  operations: {
    motion: "shield",
    element: (
      <>
        <path
          className="qitu-icon-primary"
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        />
        <path className="qitu-icon-check" d="m9 12 2 2 4-4" />
      </>
    ),
  },
  refresh: {
    motion: "refresh",
    element: (
      <>
        <g className="qitu-icon-down">
          <path d="m3 16 4 4 4-4" />
          <path d="M7 20V4" />
        </g>
        <g className="qitu-icon-up">
          <path d="m21 8-4-4-4 4" />
          <path d="M17 4v16" />
        </g>
      </>
    ),
  },
  reviews: {
    motion: "checks",
    element: (
      <>
        <path className="qitu-icon-check qitu-icon-check-one" d="M18 6 7 17l-5-5" />
        <path className="qitu-icon-check qitu-icon-check-two" d="m22 10-7.5 7.5L13 16" />
      </>
    ),
  },
  sparkles: {
    motion: "sparkles",
    element: (
      <>
        <path
          className="qitu-icon-primary"
          d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
        />
        <path className="qitu-icon-secondary" d="M20 2v4" />
        <path className="qitu-icon-secondary" d="M22 4h-4" />
        <circle className="qitu-icon-dot" cx="4" cy="20" r="2" />
      </>
    ),
  },
} satisfies Record<WorkflowIconName, IconDefinition>;
