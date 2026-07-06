import { createRbacPolicy, isRoleInPolicy, normalizeRoleForPolicy } from "./policy";
import type { Permission, RoleDefinition } from "./types";

export const roleNames = ["owner", "admin", "reviewer", "viewer"] as const;

export type RoleName = (typeof roleNames)[number];

export type Role = RoleDefinition<RoleName>;

export const rolePermissions = {
  owner: [
    "ai_advisory:write",
    "import_job:commit",
    "import_job:process",
    "import_job:retry",
    "invitation:create",
    "review:decide",
    "source_file:upload",
  ],
  admin: [
    "ai_advisory:write",
    "import_job:commit",
    "import_job:process",
    "import_job:retry",
    "invitation:create",
    "review:decide",
    "source_file:upload",
  ],
  reviewer: [
    "ai_advisory:write",
    "import_job:commit",
    "import_job:process",
    "import_job:retry",
    "review:decide",
    "source_file:upload",
  ],
  viewer: [],
} as const satisfies Record<RoleName, readonly Permission[]>;

export const starterRolePolicy = createRbacPolicy({
  fallbackRole: "viewer",
  permissions: rolePermissions,
  roles: roleNames,
});

export function isRoleName(value: string): value is RoleName {
  return isRoleInPolicy(starterRolePolicy, value);
}

export function normalizeRole(value: string | null | undefined): RoleName {
  return normalizeRoleForPolicy(starterRolePolicy, value);
}
