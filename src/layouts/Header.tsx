import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import HeaderSearch from "./header/HeaderSearch";
import NotificationPanel from "./header/NotificationPanel";
import HeaderProfile from "./header/HeaderProfile";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl flex items-center justify-between h-14 px-6 sticky top-0 z-10">
      <HeaderSearch />

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
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
        <NotificationPanel />

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-2" />

        {/* Profile + logout */}
        <HeaderProfile user={user ?? null} onLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
