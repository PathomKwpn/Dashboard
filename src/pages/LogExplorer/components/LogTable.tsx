import moment from "moment";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSortField, setSelectedLog, setPage, setPageSize } from "../logExplorer.slice";
import { selectFilteredPaginatedLogs } from "../logExplorer.slice";
import type { LogSeverity, SortField } from "../logExplorer.types";

/* ─── Severity styling ────────────────────────────────────────────────── */
const SEVERITY_STYLE: Record<LogSeverity, { badge: string; dot: string; row: string }> = {
  critical: { badge: "bg-red-500/10 text-red-400 border-red-500/20",     dot: "bg-red-500",    row: "border-l-red-500/60"    },
  error:    { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-500", row: "border-l-orange-500/60" },
  warning:  { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",  dot: "bg-amber-400",  row: "border-l-amber-400/60"  },
  info:     { badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",        dot: "bg-sky-400",    row: "border-l-sky-400/40"    },
  debug:    { badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",  dot: "bg-slate-400",  row: "border-l-border/30"     },
};

const httpStatusColor = (status: number) => {
  if (status >= 500) return "text-red-400";
  if (status >= 400) return "text-orange-400";
  if (status >= 300) return "text-sky-400";
  return "text-emerald-400";
};

/* ─── Sortable header ─────────────────────────────────────────────────── */
const SortHeader = ({
  field, label, currentField, currentOrder,
  onSort,
}: {
  field: SortField; label: string;
  currentField: SortField; currentOrder: "asc" | "desc";
  onSort: (f: SortField) => void;
}) => {
  const isActive = currentField === field;
  return (
    <TableHead
      className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-9 cursor-pointer select-none hover:text-foreground/70 transition-colors bg-muted/20"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          currentOrder === "desc"
            ? <ChevronDown className="h-3 w-3 text-primary" />
            : <ChevronUp className="h-3 w-3 text-primary" />
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-30" />
        )}
      </div>
    </TableHead>
  );
};

/* ─── Pagination bar ──────────────────────────────────────────────────── */
const PaginationBar = ({
  total, page, pageSize,
}: { total: number; page: number; pageSize: number }) => {
  const dispatch   = useAppDispatch();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from       = Math.min((page - 1) * pageSize + 1, total);
  const to         = Math.min(page * pageSize, total);

  const pageNums = () => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground/60 tabular-nums">
          {total === 0 ? "0 results" : `${from}–${to} of ${total.toLocaleString()}`}
        </span>
        <select
          value={pageSize}
          onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
          className="h-7 rounded-md border border-border/40 bg-card px-2 text-xs
                     text-foreground/80 focus:outline-none focus:ring-1 focus:ring-ring/40 cursor-pointer"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page <= 1}
          className="h-7 w-7 rounded-md border border-border/30 text-xs flex items-center justify-center
                     disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted/40 transition-colors"
        >
          ‹
        </button>
        {pageNums().map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="h-7 w-7 flex items-center justify-center text-xs text-muted-foreground/50">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => dispatch(setPage(p as number))}
              className={`h-7 w-7 rounded-md text-xs flex items-center justify-center transition-colors
                ${page === p
                  ? "bg-primary text-primary-foreground"
                  : "border border-border/30 hover:bg-muted/40"
                }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page >= totalPages}
          className="h-7 w-7 rounded-md border border-border/30 text-xs flex items-center justify-center
                     disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted/40 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
};

/* ─── Main table ──────────────────────────────────────────────────────── */
const LogTable = () => {
  const dispatch    = useAppDispatch();
  const { sort, pagination, selectedLog, loading } = useAppSelector((s) => s.logExplorer);
  const { logs, total } = useAppSelector(selectFilteredPaginatedLogs);

  if (loading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-xs">
        <div className="p-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-y border-border/30 bg-muted/20">
            <SortHeader field="timestamp"        label="Timestamp"    currentField={sort.field} currentOrder={sort.order} onSort={(f) => dispatch(toggleSortField(f))} />
            <SortHeader field="service"          label="Service"      currentField={sort.field} currentOrder={sort.order} onSort={(f) => dispatch(toggleSortField(f))} />
            <SortHeader field="severity"         label="Severity"     currentField={sort.field} currentOrder={sort.order} onSort={(f) => dispatch(toggleSortField(f))} />
            <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-9 bg-muted/20">IP</TableHead>
            <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-9 bg-muted/20">Endpoint</TableHead>
            <SortHeader field="http_status"      label="Status"       currentField={sort.field} currentOrder={sort.order} onSort={(f) => dispatch(toggleSortField(f))} />
            <SortHeader field="response_time_ms" label="Response (ms)" currentField={sort.field} currentOrder={sort.order} onSort={(f) => dispatch(toggleSortField(f))} />
            <TableHead className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 px-4 h-9 bg-muted/20">Message</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-16 text-sm text-muted-foreground/50">
                No logs match your filters
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => {
              const sv       = SEVERITY_STYLE[log.severity] ?? SEVERITY_STYLE.info;
              const isSelected = selectedLog?.id === log.id;
              return (
                <TableRow
                  key={log.id}
                  onClick={() => dispatch(setSelectedLog(isSelected ? null : log))}
                  className={`border-l-2 ${sv.row} border-border/20 cursor-pointer transition-colors
                    ${isSelected ? "bg-primary/5 hover:bg-primary/8" : "hover:bg-muted/20"}`}
                >
                  <TableCell className="px-4 py-2.5 text-xs text-muted-foreground/70 whitespace-nowrap tabular-nums">
                    {moment(log.timestamp).format("MMM DD, HH:mm:ss")}
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <span className="font-mono text-xs text-foreground/80">{log.service}</span>
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <Badge variant="outline" className={`text-[10px] font-medium capitalize rounded-md px-1.5 py-0.5 ${sv.badge}`}>
                      <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${sv.dot}`} />
                      {log.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-2.5 font-mono text-xs text-foreground/70">
                    {log.source_ip}
                  </TableCell>
                  <TableCell className="px-4 py-2.5 max-w-[180px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0">
                        {log.http_method}
                      </span>
                      <span className="font-mono text-xs text-foreground/70 truncate">
                        {log.endpoint}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2.5">
                    <span className={`font-mono text-xs font-semibold tabular-nums ${httpStatusColor(log.http_status)}`}>
                      {log.http_status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2.5 tabular-nums">
                    <span className={`text-xs font-mono ${log.response_time_ms > 2000 ? "text-red-400" : log.response_time_ms > 500 ? "text-amber-400" : "text-muted-foreground/70"}`}>
                      {log.response_time_ms.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2.5 max-w-xs">
                    <p className="truncate text-xs text-foreground/70">{log.message}</p>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <PaginationBar total={total} page={pagination.page} pageSize={pagination.pageSize} />
    </div>
  );
};

export default LogTable;
