import { Search } from "lucide-react";

const HeaderSearch = () => (
  <div className="flex items-center flex-1 max-w-xs">
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full h-8 pl-9 pr-3 rounded-lg bg-secondary/60 text-sm
                   text-foreground placeholder:text-muted-foreground/50
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-secondary
                   transition-all duration-200"
      />
    </div>
  </div>
);

export default HeaderSearch;
