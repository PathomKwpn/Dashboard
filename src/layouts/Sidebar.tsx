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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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
      `flex items-center rounded-lg py-2 text-sm  ${
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
      <Badge variant="destructive" className="rounded-full px-2 py-0.5 text-xs">
        {menu.badge}
      </Badge>
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
      className={`bg-background border-r border-border min-h-screen flex flex-col ${
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
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="text-muted-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </Button>
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
              <Avatar size={collapsed ? "sm" : "default"}>
                <AvatarFallback className="text-xs font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
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

        <Separator />

        {/* Logout button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoading}
              className={`w-full text-destructive hover:text-destructive hover:bg-destructive/10 ${
                collapsed ? "justify-center px-2" : "justify-start gap-2"
              }`}
              size="sm"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
        </Tooltip>

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
