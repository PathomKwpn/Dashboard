import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Moon, Sun, Search, Bell, Settings, LogOut } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ROLE_LABELS: Record<string, string> = {
  admin:    "Administrator",
  business: "Business",
  user:     "User",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between h-14 px-5 sticky top-0 z-10">
      {/* Left — search */}
      <div className="flex items-center flex-1 max-w-xs">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            className="w-full h-8 pl-9 pr-3 rounded-lg border border-border/60 bg-muted/40 text-sm
                       text-foreground placeholder:text-muted-foreground/40
                       focus:outline-none focus:ring-1 focus:ring-ring/50 focus:border-ring/60
                       transition-colors"
          />
        </div>
      </div>

      {/* Right — actions + profile */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="text-muted-foreground/60 hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative text-muted-foreground/60 hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-background" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground/60 hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-5 bg-border/60 mx-1" />

        {/* Profile */}
        {user && (
          <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-accent/60 transition-colors group">
            <Avatar size="sm">
              <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start leading-none">
              <span className="text-xs font-semibold text-foreground group-hover:text-foreground">
                {user.name}
              </span>
              <span className="text-[10px] text-muted-foreground/60 mt-0.5">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </button>
        )}

        {/* Sign out */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              className="text-muted-foreground/40 hover:text-destructive ml-0.5"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sign out</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
};

export default Header;
