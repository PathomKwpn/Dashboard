import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Settings,
  HelpCircle,
  Lock,
  MessageSquare,
  LogOut,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  business: "Business",
  user: "User",
};

const MenuItem = ({
  menu,
  collapsed,
}: {
  menu: (typeof GENERAL_MENUS)[0];
  collapsed: boolean;
}) => (
  <NavLink
    to={menu.to}
    className={({ isActive }) =>
      `flex items-center rounded-lg py-2 text-sm transition-all ${
        collapsed ? "justify-center px-2" : "justify-between px-3"
      } ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted"
      }`
    }
    title={collapsed ? menu.label : undefined}
  >
    <div className="flex items-center gap-3">
      <menu.icon className="h-4 w-4" />
      {!collapsed && <span>{menu.label}</span>}
    </div>
    {!collapsed && menu.badge && (
      <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white">
        {menu.badge}
      </span>
    )}
  </NavLink>
);

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={`bg-background border-r border-border min-h-screen flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            P
          </div>
          {!collapsed && <span className="text-lg font-bold">Pathom</span>}
        </div>
        <button
          onClick={onToggle}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* General */}
        <div>
          {!collapsed && (
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              General
            </h3>
          )}
          <div className="space-y-1">
            {GENERAL_MENUS.map((menu) => (
              <MenuItem key={menu.to} menu={menu} collapsed={collapsed} />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div>
          {!collapsed && (
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              Tools
            </h3>
          )}
          <div className="space-y-1">
            {TOOLS_MENUS.map((menu) => (
              <MenuItem key={menu.to} menu={menu} collapsed={collapsed} />
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          {!collapsed && (
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              Support
            </h3>
          )}
          <div className="space-y-1">
            {SUPPORT_MENUS.map((menu) => (
              <MenuItem key={menu.to} menu={menu} collapsed={collapsed} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border space-y-2 p-4">
        {/* User card */}
        {user && (
          <div
            className={`rounded-lg bg-muted/50 ${collapsed ? "p-2" : "p-3 space-y-3"}`}
            title={collapsed ? user.name : undefined}
          >
            <div
              className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}
            >
              <div className="h-9 w-9 shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                {getInitials(user.name)}
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </>
              )}
            </div>

            {/* Online indicator */}
            {!collapsed && (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  Online · {user.email}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className={`w-full flex items-center rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 ${
            collapsed ? "justify-center" : "gap-2"
          }`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {!collapsed && (
          <p className="text-xs text-muted-foreground text-center">
            © 2026 Pathom, Inc.
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
