import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { NavItem } from "./nav.config";

interface Props {
  item: NavItem;
  collapsed: boolean;
}

const Item = ({ item, collapsed }: Props) => (
  <NavLink
    to={item.to}
    className={({ isActive }) =>
      `group relative flex items-center rounded-lg py-2 text-[13px] font-medium transition-all duration-150 ${
        collapsed ? "justify-center px-2" : "justify-between px-3"
      } ${
        isActive
          ? "bg-primary/8 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      }`
    }
    title={collapsed ? item.label : undefined}
  >
    {({ isActive }) => (
      <>
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-4 rounded-r-full bg-primary" />
        )}
        <div className="flex items-center gap-3">
          <item.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} />
          {!collapsed && <span>{item.label}</span>}
        </div>
        {!collapsed && item.badge != null && (
          <Badge
            variant="destructive"
            className="rounded-full px-1.5 py-0 h-4 text-[10px] min-w-4 flex items-center justify-center"
          >
            {item.badge}
          </Badge>
        )}
      </>
    )}
  </NavLink>
);

const SidebarMenuItem = ({ item, collapsed }: Props) => {
  if (!collapsed) return <Item item={item} collapsed={collapsed} />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Item item={item} collapsed={collapsed} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
};

export default SidebarMenuItem;
