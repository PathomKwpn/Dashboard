import { ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ROLE_LABELS } from "./nav.config";

interface User {
  name: string;
  role: string;
}

interface Props {
  user: User | null;
  collapsed: boolean;
  isLoading: boolean;
  onLogout: () => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

const SidebarFooter = ({ user, collapsed, isLoading, onLogout }: Props) => (
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
        )}
      </div>
    )}

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          onClick={onLogout}
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
);

export default SidebarFooter;
