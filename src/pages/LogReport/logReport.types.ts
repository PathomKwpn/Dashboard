/* ─── Report List ────────────────────────────────────────────────────────── */
export type ReportStatus = "ready" | "generating" | "failed";
export type ReportFormat = "PDF" | "CSV" | "JSON" | "NDJSON";
export type ReportType =
  | "error_summary"
  | "traffic_summary"
  | "log_distribution"
  | "full_export";

export type Report = {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  created_at: string;
  size_kb?: number;
  rows?: number;
  requested_by: string;
};

/* ─── Error Summary ──────────────────────────────────────────────────────── */
export type ErrorByService = {
  service: string;
  count: number;
  rate: number; // percentage
  delta: number; // vs. previous period
};

export type ErrorTypeRow = {
  type: string;
  count: number;
  pct: number;
  sample_message: string;
};

export type ErrorSummaryData = {
  total_errors: number;
  error_rate: number;
  delta_pct: number;
  top_service: string;
  hourly: { hour: string; count: number }[];
  by_service: ErrorByService[];
  by_type: ErrorTypeRow[];
};

/* ─── Traffic Summary ────────────────────────────────────────────────────── */
export type TrafficHour = {
  hour: string;
  total: number;
  get: number;
  post: number;
  put: number;
  delete: number;
};

export type TrafficSummaryData = {
  total_requests: number;
  avg_rps: number;
  peak_rps: number;
  peak_hour: string;
  hourly: TrafficHour[];
  by_method: { method: string; count: number; color: string }[];
};

/* ─── Log Distribution ───────────────────────────────────────────────────── */
export type SeverityDistItem = {
  name: string;
  value: number;
  color: string;
};

export type LogDistributionData = {
  total_logs: number;
  by_severity: SeverityDistItem[];
  by_service: { service: string; critical: number; error: number; warning: number; info: number; debug: number }[];
  hourly: { hour: string; critical: number; error: number; warning: number; info: number; debug: number }[];
};

/* ─── Export ─────────────────────────────────────────────────────────────── */
export type ExportConfig = {
  format: ReportFormat;
  date_from: string;
  date_to: string;
  services: string[];
  severities: string[];
  max_rows: number;
};

/* ─── Redux State ────────────────────────────────────────────────────────── */
export type LogReportState = {
  reports:             Report[];
  errorSummary:        ErrorSummaryData | null;
  trafficSummary:      TrafficSummaryData | null;
  logDistribution:     LogDistributionData | null;
  reportsLoading:      boolean;
  errorSummaryLoading: boolean;
  trafficLoading:      boolean;
  distributionLoading: boolean;
  error?:              string;
};
