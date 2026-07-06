export { can, permissionsForRole } from "./permission-checks";
export { createRbacPolicy, isRoleInPolicy, normalizeRoleForPolicy } from "./policy";
export {
  isRoleName,
  normalizeRole,
  roleNames,
  rolePermissions,
  starterRolePolicy,
} from "./starter-policy";
export type { Role, RoleName } from "./starter-policy";
export type { Permission, Principal, RoleDefinition, RolePolicy } from "./types";
