import type { AnimatedIconName } from "./animated-icon-types";
import type { IconDefinition } from "./animated-icon-registry-types";

type ShellIconName = Extract<
  AnimatedIconName,
  | "account"
  | "language"
  | "login"
  | "logout"
  | "search"
  | "settings"
  | "theme"
  | "users"
  | "workbench"
>;

export const shellIconRegistry = {
  account: {
    motion: "user",
    element: (
      <>
        <circle className="qitu-icon-primary" cx="12" cy="8" r="5" />
        <path className="qitu-icon-secondary" d="M20 21a8 8 0 0 0-16 0" />
      </>
    ),
  },
  language: {
    motion: "globe",
    element: (
      <>
        <circle className="qitu-icon-primary" cx="12" cy="12" r="10" />
        <path className="qitu-icon-secondary" d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path className="qitu-icon-equator" d="M2 12h20" />
      </>
    ),
  },
  login: {
    motion: "login",
    element: (
      <>
        <g className="qitu-icon-arrow">
          <path d="m10 17 5-5-5-5" />
          <path d="M15 12H3" />
        </g>
        <path className="qitu-icon-secondary" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      </>
    ),
  },
  logout: {
    motion: "logout",
    element: (
      <>
        <g className="qitu-icon-arrow">
          <path d="m16 17 5-5-5-5" />
          <path d="M21 12H9" />
        </g>
        <path className="qitu-icon-secondary" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      </>
    ),
  },
  search: {
    motion: "search",
    element: (
      <g className="qitu-icon-primary">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.34-4.34" />
      </g>
    ),
  },
  settings: {
    motion: "settings",
    element: (
      <g className="qitu-icon-primary">
        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
        <circle cx="12" cy="12" r="3" />
      </g>
    ),
  },
  theme: {
    motion: "moon",
    element: (
      <path
        className="qitu-icon-primary"
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      />
    ),
  },
  users: {
    motion: "users",
    element: (
      <>
        <path className="qitu-icon-secondary" d="M18 21a8 8 0 0 0-16 0" />
        <circle className="qitu-icon-primary" cx="10" cy="8" r="5" />
        <path
          className="qitu-icon-tertiary"
          d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"
          opacity="0.7"
        />
      </>
    ),
  },
  workbench: {
    motion: "grid",
    element: (
      <>
        <rect
          className="qitu-icon-tile qitu-icon-tile-one"
          width="7"
          height="7"
          x="3"
          y="3"
          rx="1"
        />
        <rect
          className="qitu-icon-tile qitu-icon-tile-two"
          width="7"
          height="7"
          x="14"
          y="3"
          rx="1"
        />
        <rect
          className="qitu-icon-tile qitu-icon-tile-three"
          width="7"
          height="7"
          x="14"
          y="14"
          rx="1"
        />
        <rect
          className="qitu-icon-tile qitu-icon-tile-four"
          width="7"
          height="7"
          x="3"
          y="14"
          rx="1"
        />
      </>
    ),
  },
} satisfies Record<ShellIconName, IconDefinition>;
