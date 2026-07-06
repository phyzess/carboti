import type { RolePolicy } from "./types";

export function createRbacPolicy<const Role extends string>(
  policy: RolePolicy<Role>,
): RolePolicy<Role> {
  for (const role of policy.roles) {
    if (!Object.prototype.hasOwnProperty.call(policy.permissions, role)) {
      throw new Error(`RBAC role "${role}" is missing permissions.`);
    }
  }

  if (!policy.roles.includes(policy.fallbackRole)) {
    throw new Error(`RBAC fallback role "${policy.fallbackRole}" is not in roles.`);
  }

  return policy;
}

export function isRoleInPolicy<Role extends string>(
  policy: RolePolicy<Role>,
  value: string,
): value is Role {
  return policy.roles.includes(value as Role);
}

export function normalizeRoleForPolicy<Role extends string>(
  policy: RolePolicy<Role>,
  value: string | null | undefined,
): Role {
  return value && isRoleInPolicy(policy, value) ? value : policy.fallbackRole;
}
