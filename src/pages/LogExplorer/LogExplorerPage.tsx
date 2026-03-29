import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLogs } from "./logExplorer.thunks";
import { selectFilteredPaginatedLogs, selectActiveFilterCount } from "./logExplorer.slice";
import LogSearchBar     from "./components/LogSearchBar";
import LogFiltersPanel  from "./components/LogFiltersPanel";
import LogTable         from "./components/LogTable";
import LogDetailPanel   from "./components/LogDetailPanel";
import { Badge } from "@/components/ui/badge";

/* ─── Stat pill ──────────────────────────────────────────────────────── */
const StatPill = ({ label, value, color = "" }: { label: string; value: number; color?: string }) => (
  <div className="flex items-center gap-1.5">
    {color && <span className={`h-1.5 w-1.5 rounded-full ${color}`} />}
    <span className="text-sm font-semibold tabular-nums text-foreground">{value.toLocaleString()}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

/* ─── Page ───────────────────────────────────────────────────────────── */
const LogExplorerPage = () => {
  const dispatch    = useAppDispatch();
  const { allLogs, loading, error } = useAppSelector((s) => s.logExplorer);
  const { total }   = useAppSelector(selectFilteredPaginatedLogs);
  const activeFilters = useAppSelector(selectActiveFilterCount);

  useEffect(() => {
    if (allLogs.length === 0) dispatch(fetchLogs());
  }, [dispatch, allLogs.length]);

  const counts = allLogs.reduce(
    (acc, l) => { acc[l.severity] = (acc[l.severity] ?? 0) + 1; return acc; },
    {} as Record<string, number>,
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Badge variant="destructive" className="text-sm px-4 py-2">
          Error: {error}
        </Badge>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* ── Page header ── */}
      <div className="border-b border-border/40">
        <div className="max-w-screen-2xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Log Explorer
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Search, filter, and inspect application logs
            </p>
          </div>

          {allLogs.length > 0 && (
            <div className="hidden md:flex items-center gap-5">
              <StatPill label="total"    value={allLogs.length} />
              <div className="w-px h-5 bg-border" />
              <StatPill label="critical" value={counts.critical ?? 0} color="bg-red-500"    />
              <StatPill label="error"    value={counts.error    ?? 0} color="bg-orange-500" />
              <StatPill label="warning"  value={counts.warning  ?? 0} color="bg-amber-500"  />
              <StatPill label="info"     value={counts.info     ?? 0} color="bg-sky-500"    />
              <StatPill label="debug"    value={counts.debug    ?? 0} color="bg-slate-400"  />
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <LogSearchBar />
          </div>
        </div>

        <LogFiltersPanel />

        {!loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
            <span className="tabular-nums">
              <span className="font-medium text-foreground">{total.toLocaleString()}</span> result{total !== 1 ? "s" : ""}
              {activeFilters > 0 && (
                <span> · {activeFilters} filter{activeFilters !== 1 ? "s" : ""} active</span>
              )}
            </span>
          </div>
        )}

        <LogTable />
      </div>

      <LogDetailPanel />
    </div>
  );
};

export default LogExplorerPage;
