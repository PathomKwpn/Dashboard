import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setDateFrom, setDateTo, toggleSeverity,
  setServices, setIpKeyword, setHttpStatus, setCountry, clearFilters,
} from "../logExplorer.slice";
import { selectAvailableOptions, selectActiveFilterCount } from "../logExplorer.slice";
import type { LogSeverity } from "../logExplorer.types";

/* ─── Severity config ─────────────────────────────────────────────────── */
const SEVERITIES: { value: LogSeverity; label: string; dot: string; active: string }[] = [
  { value: "critical", label: "Critical", dot: "bg-red-500",    active: "bg-red-500/15 text-red-400 border-red-500/30"    },
  { value: "error",    label: "Error",    dot: "bg-orange-500", active: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  { value: "warning",  label: "Warning",  dot: "bg-amber-400",  active: "bg-amber-400/15 text-amber-400 border-amber-500/30"   },
  { value: "info",     label: "Info",     dot: "bg-sky-400",    active: "bg-sky-500/15 text-sky-400 border-sky-500/30"         },
  { value: "debug",    label: "Debug",    dot: "bg-slate-400",  active: "bg-slate-500/15 text-slate-400 border-slate-500/30"   },
];

const HTTP_STATUS_OPTIONS = [
  { value: "2", label: "2xx" },
  { value: "3", label: "3xx" },
  { value: "4", label: "4xx" },
  { value: "5", label: "5xx" },
];

/* ─── Reusable filter label ───────────────────────────────────────────── */
const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1.5 font-medium">
    {children}
  </p>
);

/* ─── Main component ──────────────────────────────────────────────────── */
const LogFiltersPanel = () => {
  const dispatch = useAppDispatch();
  const filters  = useAppSelector((s) => s.logExplorer.filters);
  const options  = useAppSelector(selectAvailableOptions);
  const activeCount = useAppSelector(selectActiveFilterCount);

  return (
    <div className="rounded-xl border border-border/50 bg-card px-5 py-4 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-xs font-medium text-foreground/80">Filters</span>
          {activeCount > 0 && (
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="h-6 px-2 text-[11px] text-muted-foreground/60 hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Severity */}
        <div>
          <FilterLabel>Severity</FilterLabel>
          <div className="flex flex-wrap gap-1">
            {SEVERITIES.map(({ value, label, dot, active }) => {
              const isActive = filters.severity.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => dispatch(toggleSeverity(value))}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-medium
                              transition-colors cursor-pointer
                              ${isActive
                                ? active
                                : "border-border/30 text-muted-foreground/60 hover:border-border/60 hover:text-foreground/80"
                              }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date From */}
        <div>
          <FilterLabel>Date From</FilterLabel>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => dispatch(setDateFrom(e.target.value))}
            className="w-full h-8 rounded-lg border border-border/40 bg-background px-2.5
                       text-xs text-foreground/80 focus:outline-none focus:ring-1
                       focus:ring-ring/40 cursor-pointer"
          />
        </div>

        {/* Date To */}
        <div>
          <FilterLabel>Date To</FilterLabel>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => dispatch(setDateTo(e.target.value))}
            className="w-full h-8 rounded-lg border border-border/40 bg-background px-2.5
                       text-xs text-foreground/80 focus:outline-none focus:ring-1
                       focus:ring-ring/40 cursor-pointer"
          />
        </div>

        {/* Service */}
        <div>
          <FilterLabel>Service</FilterLabel>
          <select
            multiple
            value={filters.services}
            onChange={(e) =>
              dispatch(
                setServices(
                  Array.from(e.target.selectedOptions, (o) => o.value),
                ),
              )
            }
            className="w-full rounded-lg border border-border/40 bg-background px-2.5 py-1
                       text-xs text-foreground/80 focus:outline-none focus:ring-1
                       focus:ring-ring/40 cursor-pointer max-h-24"
          >
            {options.services.map((s) => (
              <option key={s} value={s} className="py-0.5">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* IP + Country */}
        <div className="space-y-2">
          <div>
            <FilterLabel>Source IP</FilterLabel>
            <input
              type="text"
              value={filters.ipKeyword}
              onChange={(e) => dispatch(setIpKeyword(e.target.value))}
              placeholder="e.g. 192.168"
              className="w-full h-8 rounded-lg border border-border/40 bg-background px-2.5
                         text-xs text-foreground/80 placeholder:text-muted-foreground/40
                         focus:outline-none focus:ring-1 focus:ring-ring/40"
            />
          </div>
          <div>
            <FilterLabel>Country</FilterLabel>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => dispatch(setCountry(e.target.value))}
              placeholder="e.g. Thailand"
              className="w-full h-8 rounded-lg border border-border/40 bg-background px-2.5
                         text-xs text-foreground/80 placeholder:text-muted-foreground/40
                         focus:outline-none focus:ring-1 focus:ring-ring/40"
            />
          </div>
        </div>

        {/* HTTP Status */}
        <div>
          <FilterLabel>HTTP Status</FilterLabel>
          <div className="flex flex-wrap gap-1">
            {HTTP_STATUS_OPTIONS.map(({ value, label }) => {
              const isActive = filters.httpStatus === value;
              return (
                <button
                  key={value}
                  onClick={() =>
                    dispatch(setHttpStatus(isActive ? "" : value))
                  }
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-mono font-medium
                              transition-colors cursor-pointer
                              ${isActive
                                ? "bg-primary/15 text-primary border-primary/30"
                                : "border-border/30 text-muted-foreground/60 hover:border-border/60 hover:text-foreground/80"
                              }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogFiltersPanel;
