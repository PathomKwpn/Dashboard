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
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  roles?: UserRole[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};


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
    ],
  },
];

/* ─── Role display labels ────────────────────────────────────────────── */
export const ROLE_LABELS: Record<UserRole | string, string> = {
  admin:    "Administrator",
  business: "Business",
  user:     "User",
};
