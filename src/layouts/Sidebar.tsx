import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Settings,
  HelpCircle,
  Lock,
  MessageSquare,
} from "lucide-react";

const GENERAL_MENUS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Messages", to: "/messages", icon: MessageSquare, badge: 8 },
];

const TOOLS_MENUS = [{ label: "Events", to: "/events", icon: AlertTriangle }];

const SUPPORT_MENUS = [
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Security", to: "/security", icon: Lock },
  { label: "Help", to: "/help", icon: HelpCircle },
];

const MenuItem = ({ menu }: { menu: (typeof GENERAL_MENUS)[0] }) => (
  <NavLink
    to={menu.to}
    className={({ isActive }) =>
      `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted"
      }`
    }
  >
    <div className="flex items-center gap-3">
      <menu.icon className="h-4 w-4" />
      <span>{menu.label}</span>
    </div>
    {menu.badge && (
      <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white">
        {menu.badge}
      </span>
    )}
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="w-64 bg-background border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          N
        </div>
        <span className="text-lg font-bold">Nexus</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* General */}
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            General
          </h3>
          <div className="space-y-1">
            {GENERAL_MENUS.map((menu) => (
              <MenuItem key={menu.to} menu={menu} />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            Tools
          </h3>
          <div className="space-y-1">
            {TOOLS_MENUS.map((menu) => (
              <MenuItem key={menu.to} menu={menu} />
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
            Support
          </h3>
          <div className="space-y-1">
            {SUPPORT_MENUS.map((menu) => (
              <MenuItem key={menu.to} menu={menu} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border space-y-2 p-4">
        <div className="rounded-lg bg-sidebar p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              TM
            </div>
            <div className="text-sm font-semibold">Team Marketing</div>
          </div>
          <button className="w-full rounded-md bg-sidebar-primary px-3 py-1.5 text-xs font-semibold text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-all">
            Upgrade Plan
          </button>
        </div>
        <p className="text-xs text-muted-foreground">© 2025 Nexus.us, Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
