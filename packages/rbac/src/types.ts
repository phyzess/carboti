export type Permission =
  | "ai_advisory:write"
  | "import_job:commit"
  | "import_job:process"
  | "import_job:retry"
  | "invitation:create"
  | "review:decide"
  | "source_file:upload";

export type RoleDefinition<RoleId extends string = string> = {
  id: RoleId;
  name: string;
  permissions: readonly Permission[];
};

export type Principal<R extends string = string> = {
  id: string;
  role: R;
};

export type RolePolicy<Role extends string = string> = {
  fallbackRole: Role;
  permissions: Record<Role, readonly Permission[]>;
  roles: readonly Role[];
};
