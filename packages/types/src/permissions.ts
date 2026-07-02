/**
 * PERMISSIONS
 * Single-tenant school site — two roles: ADMIN and MANAGER.
 * Manager covers all day-to-day content work; Admin additionally controls
 * Branding (logo/colors/identity), Team (who has access), and the Activity Log.
 */
export const PERMISSIONS = {
  MANAGE_CONTENT:   "manage_content",    // Site Content (Home/About/Academics/etc.), News & Blog
  VIEW_ANALYTICS:   "view_analytics",
  MANAGE_BRANDING:  "manage_branding",   // logo, theme colors, school name/motto
  MANAGE_TEAM:      "manage_team",       // invite/manage Admin & Manager accounts
  VIEW_ACTIVITY_LOG: "view_activity_log",
} as const;

export type PermissionType = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
