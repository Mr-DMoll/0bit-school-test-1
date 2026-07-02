import { PERMISSIONS, PermissionType } from "./permissions.js";
import { Role } from "./enums.js";

export const USER_ROLES = Role;
export type UserRoleType = Role;

export const ROLE_PERMISSIONS: Record<UserRoleType, PermissionType[]> = {
  ADMIN: [
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_BRANDING,
    PERMISSIONS.MANAGE_TEAM,
    PERMISSIONS.VIEW_ACTIVITY_LOG,
  ],
  MANAGER: [
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

export const hasPermission = (
  role: UserRoleType,
  permission: PermissionType,
): boolean => (ROLE_PERMISSIONS[role] ?? []).includes(permission);
