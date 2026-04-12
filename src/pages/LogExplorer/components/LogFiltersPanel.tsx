import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown, Check, X, Calendar } from "lucide-react";
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
  { value: "critical", label: "Critical", dot: "bg-red-500",    active: "bg-red-500/10 text-red-400 border-red-500/25"        },
  { value: "error",    label: "Error",    dot: "bg-orange-500", active: "bg-orange-500/10 text-orange-400 border-orange-500/25" },
  { value: "warning",  label: "Warning",  dot: "bg-amber-400",  active: "bg-amber-400/10 text-amber-400 border-amber-500/25"   },
  { value: "info",     label: "Info",     dot: "bg-sky-400",    active: "bg-sky-500/10 text-sky-400 border-sky-500/25"         },
  { value: "debug",    label: "Debug",    dot: "bg-slate-400",  active: "bg-slate-500/10 text-slate-400 border-slate-500/25"   },
];

const HTTP_STATUS_OPTIONS = [
  { value: "2", label: "2xx" },
  { value: "3", label: "3xx" },
  { value: "4", label: "4xx" },
  { value: "5", label: "5xx" },
];

/* ─── Filter label ────────────────────────────────────────────────────── */
const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 mb-1.5 font-medium select-none">
    {children}
  </p>
);

/* ─── Date input — Linear-styled ─────────────────────────────────────── */
const DateInput = ({
  value,
  onChange,
  placeholder = "yyyy-mm-dd",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value !== "";

  return (
    <div
      className={`relative flex items-center h-8 w-full rounded-md border transition-colors cursor-pointer
        ${hasValue
          ? "border-primary/40 bg-primary/5"
          : "border-border/40 bg-transparent hover:border-border/70"
        }`}
      onClick={() => inputRef.current?.showPicker?.()}
    >
      <Calendar
        className={`absolute left-2.5 h-3 w-3 pointer-events-none transition-colors
          ${hasValue ? "text-primary/70" : "text-muted-foreground/40"}`}
      />
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-transparent pl-7 pr-2 text-[11px] text-foreground/80
                   placeholder:text-muted-foreground/40 focus:outline-none cursor-pointer
                   scheme-light dark:scheme-dark
                   [&::-webkit-calendar-picker-indicator]:opacity-0
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:inset-0
                   [&::-webkit-calendar-picker-indicator]:w-full
                   [&::-webkit-calendar-picker-indicator]:h-full
                   [&::-webkit-calendar-picker-indicator]:cursor-pointer"
      />
      {hasValue && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(""); }}
          className="absolute right-2 text-muted-foreground/40 hover:text-foreground/70 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

/* ─── Service multi-select ────────────────────────────────────────────── */
const ServiceMultiSelect = ({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val],
    );
  };

  const removeOne = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== val));
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 w-full min-h-8 rounded-md border px-2.5 py-1.5
                    text-left transition-colors
                    ${open
                      ? "border-primary/40 bg-primary/5"
                      : selected.length > 0
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/40 bg-transparent hover:border-border/70"
                    }`}
      >
        {/* Selected chips or placeholder */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-[11px] text-muted-foreground/40">All services</span>
          ) : (
            selected.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded
                           bg-primary/10 border border-primary/20 text-[10px] text-primary
                           max-w-22.5 truncate"
                style={{ fontVariationSettings: '"wght" 510' }}
              >
                <span className="truncate">{s}</span>
                <X
                  className="h-2.5 w-2.5 shrink-0 opacity-60 hover:opacity-100 cursor-pointer"
                  onClick={(e) => removeOne(s, e)}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`h-3 w-3 shrink-0 text-muted-foreground/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border/60
                     bg-popover shadow-lg overflow-hidden"
          style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)" }}
        >
          {/* Clear all */}
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex items-center justify-between w-full px-3 py-2 text-[11px]
                         text-muted-foreground/60 hover:text-foreground hover:bg-accent/50
                         border-b border-border/30 transition-colors"
            >
              <span>Clear all</span>
              <span className="tabular-nums">{selected.length} selected</span>
            </button>
          )}

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto py-1">
            {options.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-left
                              transition-colors
                              ${isSelected
                                ? "text-foreground bg-primary/5"
                                : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                              }`}
                >
                  {/* Checkbox */}
                  <span
                    className={`flex-none flex items-center justify-center h-3.5 w-3.5 rounded-sm border transition-colors
                      ${isSelected
                        ? "bg-primary border-primary"
                        : "border-border/60 bg-transparent"
                      }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />}
                  </span>
                  <span style={{ fontVariationSettings: '"wght" 510' }}>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Main component ──────────────────────────────────────────────────── */
const LogFiltersPanel = () => {
  const dispatch    = useAppDispatch();
  const filters     = useAppSelector((s) => s.logExplorer.filters);
  const options     = useAppSelector(selectAvailableOptions);
  const activeCount = useAppSelector(selectActiveFilterCount);

  return (
    <div className="rounded-lg border border-border/50 bg-card px-5 py-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/50" />
          <span className="text-xs text-foreground/80" style={{ fontVariationSettings: '"wght" 510' }}>
            Filters
          </span>
          {activeCount > 0 && (
            <span
              className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full
                         bg-primary text-primary-foreground text-[10px] tabular-nums"
              style={{ fontVariationSettings: '"wght" 590' }}
            >
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFilters())}
            className="h-6 px-2 text-[11px] text-muted-foreground/50 hover:text-foreground gap-1"
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
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px]
                              transition-colors cursor-pointer
                              ${isActive
                                ? active
                                : "border-border/30 text-muted-foreground/50 hover:border-border/60 hover:text-foreground/80"
                              }`}
                  style={{ fontVariationSettings: '"wght" 510' }}
                >
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dot}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Date From */}
        <div>
          <FilterLabel>Date From</FilterLabel>
          <DateInput
            value={filters.dateFrom}
            onChange={(v) => dispatch(setDateFrom(v))}
          />
        </div>

        {/* Date To */}
        <div>
          <FilterLabel>Date To</FilterLabel>
          <DateInput
            value={filters.dateTo}
            onChange={(v) => dispatch(setDateTo(v))}
          />
        </div>

        {/* Service — multi-select */}
        <div>
          <FilterLabel>Service</FilterLabel>
          <ServiceMultiSelect
            options={options.services}
            selected={filters.services}
            onChange={(v) => dispatch(setServices(v))}
          />
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
              className="w-full h-8 rounded-md border border-border/40 bg-transparent px-2.5
                         text-[11px] text-foreground/80 placeholder:text-muted-foreground/40
                         focus:outline-none focus:border-primary/40 focus:bg-primary/5
                         transition-colors hover:border-border/70"
            />
          </div>
          <div>
            <FilterLabel>Country</FilterLabel>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => dispatch(setCountry(e.target.value))}
              placeholder="e.g. Thailand"
              className="w-full h-8 rounded-md border border-border/40 bg-transparent px-2.5
                         text-[11px] text-foreground/80 placeholder:text-muted-foreground/40
                         focus:outline-none focus:border-primary/40 focus:bg-primary/5
                         transition-colors hover:border-border/70"
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
                  onClick={() => dispatch(setHttpStatus(isActive ? "" : value))}
                  className={`px-2.5 py-1 rounded-md border text-[11px] font-mono
                              transition-colors cursor-pointer
                              ${isActive
                                ? "bg-primary/10 text-primary border-primary/25"
                                : "border-border/30 text-muted-foreground/50 hover:border-border/60 hover:text-foreground/80"
                              }`}
                  style={{ fontVariationSettings: '"wght" 510' }}
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
