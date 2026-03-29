import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setKeyword, setSearchField } from "../logExplorer.slice";
import type { LogFilters } from "../logExplorer.types";

const FIELD_OPTIONS: { value: LogFilters["searchField"]; label: string }[] = [
  { value: "all",       label: "All Fields" },
  { value: "message",   label: "Message"    },
  { value: "source_ip", label: "Source IP"  },
  { value: "service",   label: "Service"    },
];

const LogSearchBar = () => {
  const dispatch = useAppDispatch();
  const { keyword, searchField } = useAppSelector(
    (s) => s.logExplorer.filters,
  );

  return (
    <div className="flex items-center gap-2">
      {/* Field selector */}
      <select
        value={searchField}
        onChange={(e) =>
          dispatch(setSearchField(e.target.value as LogFilters["searchField"]))
        }
        className="h-9 rounded-lg border border-border/50 bg-card px-3 text-xs text-foreground/80
                   focus:outline-none focus:ring-1 focus:ring-ring/50 shrink-0 cursor-pointer
                   shadow-xs hover:border-border/80 transition-colors"
      >
        {FIELD_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
        <Input
          value={keyword}
          onChange={(e) => dispatch(setKeyword(e.target.value))}
          placeholder="Search logs…"
          className="pl-9 pr-8 h-9 border-border/50 bg-card text-sm placeholder:text-muted-foreground/35
                     focus-visible:ring-ring/50 shadow-xs"
        />
        {keyword && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => dispatch(setKeyword(""))}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/40
                       hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default LogSearchBar;
