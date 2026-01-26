import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const Hearder = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <span className="font-medium">Dashboard</span>

      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </header>
  );
};

export default Hearder;
