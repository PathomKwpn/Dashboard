import { useState } from "react";
import moment from "moment";
import { ChevronUp, ChevronDown, ChevronsUpDown, X } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleSortField,
  setSelectedLog,
  setPage,
  setPageSize,
} from "../logExplorer.slice";
import { selectFilteredPaginatedLogs } from "../logExplorer.slice";
import type { LogSeverity, SortField } from "../logExplorer.types";

interface Props {
  showCheckbox?: boolean;
}

/* ─── Severity styling ────────────────────────────────────────────────── */
const SEVERITY_STYLE: Record<
  LogSeverity,
  { badge: string; dot: string; row: string }
> = {
  critical: {
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-500",
    row: "border-l-red-500/60",
  },
  error: {
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dot: "bg-orange-500",
    row: "border-l-orange-500/60",
  },
  warning: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
    row: "border-l-amber-400/60",
  },
  info: {
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    dot: "bg-sky-400",
    row: "border-l-sky-400/40",
  },
  debug: {
    badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    dot: "bg-slate-400",
    row: "border-l-border/30",
  },
};

const httpStatusColor = (status: number) => {
  if (status >= 500) return "text-red-400";
  if (status >= 400) return "text-orange-400";
  if (status >= 300) return "text-sky-400";
  return "text-emerald-400";
};

/* ─── Sortable header ─────────────────────────────────────────────────── */
const SortHeader = ({
  field,
  label,
  currentField,
  currentOrder,
  onSort,
}: {
  field: SortField;
  label: string;
  currentField: SortField;
  currentOrder: "asc" | "desc";
  onSort: (f: SortField) => void;
}) => {
  const isActive = currentField === field;
  return (
    <TableHead
      className="text-[11px] font-510 text-muted-foreground/50 px-4 h-8 cursor-pointer
                 select-none hover:text-foreground/60 transition-colors bg-background"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          currentOrder === "desc" ? (
            <ChevronDown className="h-3 w-3 text-primary" />
          ) : (
            <ChevronUp className="h-3 w-3 text-primary" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 opacity-25" />
        )}
      </div>
    </TableHead>
  );
};

/* ─── Pagination bar ──────────────────────────────────────────────────── */
const PaginationBar = ({
  total,
  page,
  pageSize,
  selectedCount,
  onClearSelection,
}: {
  total: number;
  page: number;
  pageSize: number;
  selectedCount: number;
  onClearSelection: () => void;
}) => {
  const dispatch = useAppDispatch();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);

  const pageNums = () => {
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("…");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40">
      <div className="flex items-center gap-2.5">
        {selectedCount > 0 ? (
          <span className="flex items-center gap-1.5 text-[11px] font-510 text-foreground">
            {selectedCount} selected
            <button
              onClick={onClearSelection}
              className="h-4 w-4 rounded flex items-center justify-center
                         text-muted-foreground hover:text-foreground hover:bg-accent/60
                         transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground/60 tabular-nums font-510">
            {total === 0
              ? "0 results"
              : `${from}–${to} of ${total.toLocaleString()}`}
          </span>
        )}
        <select
          value={pageSize}
          onChange={(e) => {
            dispatch(setPageSize(Number(e.target.value)));
            dispatch(setPage(1));
          }}
          className="h-6 rounded border border-border/60 bg-transparent px-1.5
                     text-[11px] text-muted-foreground focus:outline-none
                     focus:ring-1 focus:ring-ring/30 cursor-pointer
                     hover:border-border transition-colors"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page <= 1}
          className="h-6 w-6 rounded border border-border/50 text-[11px] flex items-center
                     justify-center text-muted-foreground disabled:opacity-25
                     disabled:cursor-not-allowed hover:bg-accent/50 hover:text-foreground
                     transition-colors"
        >
          ‹
        </button>
        {pageNums().map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="h-6 w-6 flex items-center justify-center text-[11px] text-muted-foreground/40"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => dispatch(setPage(p as number))}
              className={`h-6 w-6 rounded text-[11px] flex items-center justify-center transition-colors font-510
                ${
                  page === p
                    ? "bg-primary text-primary-foreground border border-primary"
                    : "border border-border/50 text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page >= totalPages}
          className="h-6 w-6 rounded border border-border/50 text-[11px] flex items-center
                     justify-center text-muted-foreground disabled:opacity-25
                     disabled:cursor-not-allowed hover:bg-accent/50 hover:text-foreground
                     transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );
};

/* ─── Main table ──────────────────────────────────────────────────────── */
const LogTable = ({ showCheckbox = true }: Props) => {
  const dispatch = useAppDispatch();
  const { sort, pagination, selectedLog, loading } = useAppSelector(
    (s) => s.logExplorer,
  );
  const { logs, total } = useAppSelector(selectFilteredPaginatedLogs);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 space-y-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const colCount = showCheckbox ? 9 : 8;

  return (
    <div
      className="rounded-xl border border-border bg-card overflow-hidden flex flex-col"
      style={{ minHeight: `${10 * 36 + 76}px` }}
    >
      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-y border-border/40 bg-background">
              <SortHeader
                field="timestamp"
                label="Timestamp"
                currentField={sort.field}
                currentOrder={sort.order}
                onSort={(f) => dispatch(toggleSortField(f))}
              />
              <SortHeader
                field="service"
                label="Service"
                currentField={sort.field}
                currentOrder={sort.order}
                onSort={(f) => dispatch(toggleSortField(f))}
              />
              <SortHeader
                field="severity"
                label="Severity"
                currentField={sort.field}
                currentOrder={sort.order}
                onSort={(f) => dispatch(toggleSortField(f))}
              />
              <TableHead className="text-[11px] font-510 text-muted-foreground/50 px-4 h-8 bg-background">
                IP
              </TableHead>
              <TableHead className="text-[11px] font-510 text-muted-foreground/50 px-4 h-8 bg-background">
                Endpoint
              </TableHead>
              <SortHeader
                field="http_status"
                label="Status"
                currentField={sort.field}
                currentOrder={sort.order}
                onSort={(f) => dispatch(toggleSortField(f))}
              />
              <SortHeader
                field="response_time_ms"
                label="Response (ms)"
                currentField={sort.field}
                currentOrder={sort.order}
                onSort={(f) => dispatch(toggleSortField(f))}
              />
              <TableHead className="text-[11px] font-510 text-muted-foreground/50 px-4 h-8 bg-background">
                Message
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={colCount}
                  className="text-center py-16 text-[13px] text-muted-foreground/40"
                >
                  No logs match your filters
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => {
                const sv = SEVERITY_STYLE[log.severity] ?? SEVERITY_STYLE.info;
                const isDetailSelected = selectedLog?.id === log.id;
                const isChecked = showCheckbox && selectedIds.has(log.id);
                return (
                  <TableRow
                    key={log.id}
                    onClick={() =>
                      dispatch(setSelectedLog(isDetailSelected ? null : log))
                    }
                    className={`border-l-2 ${sv.row} border-border/30 cursor-pointer transition-colors
                    ${
                      isChecked || isDetailSelected
                        ? "bg-primary/8 hover:bg-primary/10"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <TableCell className="px-4 py-2 text-[11px] text-muted-foreground/60 whitespace-nowrap tabular-nums font-510">
                      {moment(log.timestamp).format("MMM DD, HH:mm:ss")}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span className="font-mono text-[12px] text-foreground/75">
                        {log.service}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-510 capitalize rounded-sm px-1.5 py-0.5 ${sv.badge}`}
                      >
                        <span
                          className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${sv.dot}`}
                        />
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-2 font-mono text-[12px] text-foreground/65">
                      {log.source_ip}
                    </TableCell>
                    <TableCell className="px-4 py-2 max-w-45">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-mono text-muted-foreground/40 shrink-0">
                          {log.http_method}
                        </span>
                        <span className="font-mono text-[11px] text-foreground/65 truncate">
                          {log.endpoint}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      <span
                        className={`font-mono text-[12px] font-510 tabular-nums ${httpStatusColor(log.http_status)}`}
                      >
                        {log.http_status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2 tabular-nums">
                      <span
                        className={`text-[11px] font-mono ${
                          log.response_time_ms > 2000
                            ? "text-red-400"
                            : log.response_time_ms > 500
                              ? "text-amber-400"
                              : "text-muted-foreground/60"
                        }`}
                      >
                        {log.response_time_ms.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-2 max-w-xs">
                      <p className="truncate text-[12px] text-foreground/60">
                        {log.message}
                      </p>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar
        total={total}
        page={pagination.page}
        pageSize={pagination.pageSize}
        selectedCount={showCheckbox ? selectedIds.size : 0}
        onClearSelection={() => setSelectedIds(new Set())}
      />
    </div>
  );
};

export default LogTable;
