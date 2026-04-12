import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  MessageSquare,
  AlertTriangle,
  ScrollText,
  Globe,
  FileBarChart2,
  BarChart3,
  Settings,
  Lock,
  HelpCircle,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type UserRole = "admin" | "business" | "user";

export type NavItem = {
  /** Display label */
  label: string;
  /** Route path */
  to: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Notification badge count */
  badge?: number;
  /**
   * Roles that can see this item.
   * Omit (or leave undefined) to allow all roles.
   */
  roles?: UserRole[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

/* ─── Navigation config ──────────────────────────────────────────────────
 *
 *  To add a new module:
 *    1. Import the icon from lucide-react
 *    2. Add a NavItem entry below
 *    3. Set `roles` to restrict access — omit for public access
 *
 * ─────────────────────────────────────────────────────────────────────── */
export const NAV_CONFIG: NavSection[] = [
  {
    label: "General",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "Messages",  to: "/messages",  icon: MessageSquare, badge: 8 },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Events",         to: "/events",         icon: AlertTriangle  },
      { label: "Log Explorer",   to: "/log-explorer",   icon: ScrollText     },
      { label: "Geo Detection",  to: "/geo-detection",  icon: Globe          },
      { label: "Log Report",     to: "/log-report",     icon: FileBarChart2  },
      { label: "Log Analytics",  to: "/log-analytics",  icon: BarChart3      },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Settings", to: "/settings", icon: Settings, roles: ["admin"] },
      { label: "Security", to: "/security", icon: Lock,     roles: ["admin", "business"] },
      { label: "Help",     to: "/help",     icon: HelpCircle },
    ],
  },
];

/* ─── Role display labels ────────────────────────────────────────────── */
export const ROLE_LABELS: Record<UserRole | string, string> = {
  admin:    "Administrator",
  business: "Business",
  user:     "User",
};
