export type AnimatedIconName =
  | "account"
  | "activity"
  | "audit"
  | "database"
  | "files"
  | "intake"
  | "key"
  | "language"
  | "login"
  | "logout"
  | "operations"
  | "refresh"
  | "reviews"
  | "search"
  | "settings"
  | "sparkles"
  | "theme"
  | "users"
  | "workbench";

export type AnimatedIconProps = {
  className?: string | undefined;
  name: AnimatedIconName;
  size?: number | string | undefined;
  title?: string | undefined;
};

export type IconMotion =
  | "activity"
  | "boxes"
  | "checks"
  | "folder"
  | "globe"
  | "grid"
  | "key"
  | "login"
  | "logout"
  | "moon"
  | "refresh"
  | "search"
  | "settings"
  | "shield"
  | "sparkles"
  | "upload"
  | "user"
  | "users";
