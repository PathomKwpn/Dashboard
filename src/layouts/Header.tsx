import { Button } from "@/components/ui/button";
import { Moon, Sun, Search, Bell, Settings } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background flex items-center justify-between h-16 px-6 sticky top-0 z-10">
      {/* Left side - Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg bg-muted/50 border border-input pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center gap-3 ml-8">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border"></div>

        {/* Profile */}
        <Button variant="ghost" className="flex items-center gap-2 px-3 h-9">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            YA
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold">Young Alasła</span>
            <span className="text-xs text-muted-foreground">Business</span>
          </div>
        </Button>
      </div>
    </header>
  );
};

export default Header;
