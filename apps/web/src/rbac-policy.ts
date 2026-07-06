import {
  can,
  createRbacPolicy,
  normalizeRoleForPolicy,
  rolePermissions,
  roleNames,
  type Permission,
  type Principal,
} from "@carboti/rbac";

export const appRolePolicy = createRbacPolicy({
  fallbackRole: "viewer",
  permissions: rolePermissions,
  roles: roleNames,
});

export type AppRoleName = (typeof appRolePolicy.roles)[number];

export function normalizeAppRole(value: string | null | undefined): AppRoleName {
  return normalizeRoleForPolicy(appRolePolicy, value);
}

export function appCan(principal: Principal<AppRoleName>, permission: Permission): boolean {
  return can(principal, permission, appRolePolicy);
}
