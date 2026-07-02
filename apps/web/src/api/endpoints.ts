export const endpoints = {
  // Auth — single-tenant: just the one seeded admin account, no
  // self-registration, password reset, or email verification.
  auth: {
    login:       "/auth/login",
    me:          "/auth/me",
    logout:      "/auth/logout",
    setPassword: "/auth/set-password",
  },

  // School — branding, identity, contact info, principal, stats
  school: {
    get:    "/school",
    update: "/school",
  },

  // Posts — News & Blog (shared model, filtered by `type`)
  posts: {
    list:   "/posts",
    create: "/posts",
    update: (id: string) => `/posts/${id}`,
    delete: (id: string) => `/posts/${id}`,
  },

  // Activity Log — Admin only
  audit: {
    list: "/audit",
  },

  // Team — Admin only (invite/manage Admin & Manager accounts)
  team: {
    list:   "/team",
    invite: "/team/invite",
    remove: (id: string) => `/team/${id}`,
  },

  // Analytics — visible to Admin and Manager
  analytics: {
    summary: "/analytics/summary",
  },

  // Upload — authenticated, returns { data: { url } }
  upload: "/upload",
};
