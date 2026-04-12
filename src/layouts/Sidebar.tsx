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
  ScrollText,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const GENERAL_MENUS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Messages", to: "/messages", icon: MessageSquare, badge: 8 },
];

const TOOLS_MENUS = [
  { label: "Events", to: "/events", icon: AlertTriangle },
  { label: "Log Explorer", to: "/log-explorer", icon: ScrollText },
  { label: "Geo Detection", to: "/geo-detection", icon: Globe },
];

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

/* ─── Nav item ──────────────────────────────────────────────────────────── */
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
      `group relative flex items-center rounded-lg py-2 text-[13px] font-medium transition-all duration-150 ${
        collapsed ? "justify-center px-2" : "justify-between px-3"
      } ${
        isActive
          ? "bg-primary/8 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`
    }
    title={collapsed ? menu.label : undefined}
  >
    {({ isActive }) => (
      <>
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-4 rounded-r-full bg-primary" />
        )}
        <div className="flex items-center gap-3">
          <menu.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} />
          {!collapsed && <span>{menu.label}</span>}
        </div>
        {!collapsed && menu.badge && (
          <Badge
            variant="destructive"
            className="rounded-full px-1.5 py-0 h-4 text-[10px] min-w-4 flex items-center justify-center"
          >
            {menu.badge}
          </Badge>
        )}
      </>
    )}
  </NavLink>
);

/* ─── Section label ─────────────────────────────────────────────────────── */
const SectionLabel = ({ label }: { label: string }) => (
  <h3 className="mb-2 px-3 text-[11px] font-medium tracking-wide text-muted-foreground/50 select-none">
    {label}
  </h3>
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

/* ─── Sidebar ───────────────────────────────────────────────────────────── */
const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={`bg-sidebar border-r border-sidebar-border min-h-screen flex flex-col transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* ── Brand ── */}
      <div className="flex items-center justify-between border-b border-sidebar-border h-14 px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm shrink-0 select-none">
            P
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Pathom
              </span>
              <span className="block text-[10px] text-muted-foreground font-normal leading-none mt-0.5">
                Dashboard
              </span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronsLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!collapsed && <SectionLabel label="General" />}
          <div className="space-y-0.5">
            {GENERAL_MENUS.map((menu) =>
              collapsed ? (
                <Tooltip key={menu.to}>
                  <TooltipTrigger asChild>
                    <span>
                      <MenuItem menu={menu} collapsed={collapsed} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">{menu.label}</TooltipContent>
                </Tooltip>
              ) : (
                <MenuItem key={menu.to} menu={menu} collapsed={collapsed} />
              ),
            )}
          </div>
        </div>

        <div>
          {!collapsed && <SectionLabel label="Tools" />}
          <div className="space-y-0.5">
            {TOOLS_MENUS.map((menu) =>
              collapsed ? (
                <Tooltip key={menu.to}>
                  <TooltipTrigger asChild>
                    <span>
                      <MenuItem menu={menu} collapsed={collapsed} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">{menu.label}</TooltipContent>
                </Tooltip>
              ) : (
                <MenuItem key={menu.to} menu={menu} collapsed={collapsed} />
              ),
            )}
          </div>
        </div>

        <div>
          {!collapsed && <SectionLabel label="Support" />}
          <div className="space-y-0.5">
            {SUPPORT_MENUS.map((menu) =>
              collapsed ? (
                <Tooltip key={menu.to}>
                  <TooltipTrigger asChild>
                    <span>
                      <MenuItem menu={menu} collapsed={collapsed} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">{menu.label}</TooltipContent>
                </Tooltip>
              ) : (
                <MenuItem key={menu.to} menu={menu} collapsed={collapsed} />
              ),
            )}
          </div>
        </div>
      </nav>

      {/* ── Footer ── */}
      <div className="border-t border-sidebar-border px-3 py-3 space-y-2">
        {user && (
          <div
            className={`rounded-xl bg-accent/50 ${
              collapsed ? "p-2 flex justify-center" : "p-3"
            }`}
            title={collapsed ? user.name : undefined}
          >
            {collapsed ? (
              <Avatar size="sm">
                <AvatarFallback className="text-[10px] font-semibold bg-primary/8 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <Avatar size="sm">
                    <AvatarFallback className="text-[10px] font-semibold bg-primary/8 text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate text-foreground">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {ROLE_LABELS[user.role] ?? user.role}
                    </p>
                  </div>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                </div>
              </div>
            )}
          </div>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={isLoading}
              size="sm"
              className={`w-full text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors ${
                collapsed ? "justify-center px-2" : "justify-start gap-2 px-3"
              }`}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              {!collapsed && <span className="text-xs">Sign Out</span>}
            </Button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
