/* ─── Enums ─────────────────────────────────────────────────────────────── */
export type LogSeverity  = "critical" | "error" | "warning" | "info" | "debug";
export type HttpMethod   = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type SortOrder    = "asc" | "desc";
export type SortField    = "timestamp" | "service" | "severity" | "response_time_ms" | "http_status";
export type SearchField  = "all" | "message" | "source_ip" | "service";

/* ─── Log Entry ─────────────────────────────────────────────────────────── */
export interface LogEntry {
  id:               string;
  timestamp:        string;        // ISO string
  service:          string;
  severity:         LogSeverity;
  source_ip:        string;
  country:          string;
  endpoint:         string;
  http_method:      HttpMethod;
  http_status:      number;
  response_time_ms: number;
  message:          string;
  user_agent:       string;
  hostname:         string;
  raw_log:          string;
  meta:             Record<string, unknown>;
}

/* ─── Filter State ──────────────────────────────────────────────────────── */
export interface LogFilters {
  keyword:     string;
  searchField: SearchField;
  dateFrom:    string;      // YYYY-MM-DD
  dateTo:      string;      // YYYY-MM-DD
  severity:    LogSeverity[];
  services:    string[];
  ipKeyword:   string;
  httpStatus:  string;      // "" | "2" | "3" | "4" | "5"  (leading digit)
  country:     string;
}

/* ─── Pagination ────────────────────────────────────────────────────────── */
export interface LogPagination {
  page:     number;
  pageSize: number;
}

/* ─── Sort ──────────────────────────────────────────────────────────────── */
export interface LogSort {
  field: SortField;
  order: SortOrder;
}

/* ─── Redux State ───────────────────────────────────────────────────────── */
export interface LogExplorerState {
  allLogs:    LogEntry[];
  selectedLog: LogEntry | null;
  filters:    LogFilters;
  sort:       LogSort;
  pagination: LogPagination;
  loading:    boolean;
  error?:     string;
}
