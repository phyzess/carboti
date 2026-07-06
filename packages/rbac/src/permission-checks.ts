import { starterRolePolicy } from "./starter-policy";
import type { Permission, Principal, RolePolicy } from "./types";

export function can<Role extends string>(
  principal: Principal<Role>,
  permission: Permission,
  policy: RolePolicy<Role> = starterRolePolicy as unknown as RolePolicy<Role>,
): boolean {
  return (policy.permissions[principal.role] ?? []).includes(permission);
}

export function permissionsForRole<Role extends string>(
  role: Role,
  policy: RolePolicy<Role> = starterRolePolicy as unknown as RolePolicy<Role>,
): readonly Permission[] {
  return policy.permissions[role] ?? [];
}
