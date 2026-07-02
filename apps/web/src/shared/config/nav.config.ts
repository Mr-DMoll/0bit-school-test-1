export interface NavItem {
  href:  string;
  label: string;
  icon:  string;
}

export interface NavGroup {
  label?: string;
  items:  NavItem[];
}

// Two roles: ADMIN (everything, including Branding/Team) and MANAGER
// (day-to-day content — Site Content, News & Blog, Analytics — but not
// Branding, Team, or the Activity Log).
export const NAV_CONFIG: Record<string, NavGroup[]> = {
  ADMIN: [
    {
      items: [
        { href: "/admin/dashboard", label: "Overview", icon: "LayoutDashboard" },
        { href: "/admin/branding", label: "Branding", icon: "Palette"        },
        { href: "/admin/site", label: "Site",      icon: "FileText"      },
        { href: "/admin/work", label: "Work",      icon: "FolderKanban"   },
        { href: "/admin/analytics", label: "Analytics", icon: "BarChart3" },
        { href: "/admin/team", label: "Team",      icon: "Users"          },
        { href: "/admin/activity", label: "Activity Log", icon: "History" },
      ],
    },
  ],
  MANAGER: [
    {
      items: [
        { href: "/admin/dashboard", label: "Overview", icon: "LayoutDashboard" },
        { href: "/admin/site", label: "Site",      icon: "FileText"      },
        { href: "/admin/work", label: "Work",      icon: "FolderKanban"   },
        { href: "/admin/analytics", label: "Analytics", icon: "BarChart3" },
      ],
    },
  ],
};
