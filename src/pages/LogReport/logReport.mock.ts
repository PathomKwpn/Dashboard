import type {
  Report, ErrorSummaryData, TrafficSummaryData, LogDistributionData,
} from "./logReport.types";

const SERVICES = ["auth-service", "api-gateway", "user-service", "payment-service", "notification-service"];

/* ─── Report List ────────────────────────────────────────────────────────── */
const MOCK_REPORTS: Report[] = [
  { id: "r1", name: "Error Summary – Apr 2025",    type: "error_summary",    format: "PDF",   status: "ready",      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),   size_kb: 142,  rows: undefined,  requested_by: "admin" },
  { id: "r2", name: "Full Log Export – Apr 11",    type: "full_export",      format: "NDJSON",status: "ready",      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),   size_kb: 8240, rows: 184320,     requested_by: "admin" },
  { id: "r3", name: "Traffic Summary – Week 15",   type: "traffic_summary",  format: "CSV",   status: "ready",      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),  size_kb: 56,   rows: 1440,       requested_by: "business" },
  { id: "r4", name: "Log Distribution – Apr 10",   type: "log_distribution", format: "JSON",  status: "ready",      created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),  size_kb: 28,   rows: undefined,  requested_by: "admin" },
  { id: "r5", name: "Error Summary – Apr 10",      type: "error_summary",    format: "PDF",   status: "generating", created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),         size_kb: undefined, rows: undefined, requested_by: "admin" },
  { id: "r6", name: "Full Log Export – Apr 9",     type: "full_export",      format: "CSV",   status: "failed",     created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),  size_kb: undefined, rows: undefined, requested_by: "user" },
  { id: "r7", name: "Traffic Summary – Week 14",   type: "traffic_summary",  format: "CSV",   status: "ready",      created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),  size_kb: 49,   rows: 1440,       requested_by: "business" },
  { id: "r8", name: "Log Distribution – Apr 8",    type: "log_distribution", format: "JSON",  status: "ready",      created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),  size_kb: 31,   rows: undefined,  requested_by: "admin" },
];

/* ─── Error Summary ──────────────────────────────────────────────────────── */
const MOCK_ERROR_SUMMARY: ErrorSummaryData = {
  total_errors: 4821,
  error_rate: 8.4,
  delta_pct: -12.3,
  top_service: "auth-service",
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    count: Math.floor(80 + Math.random() * 200 + (i >= 9 && i <= 17 ? 150 : 0)),
  })),
  by_service: [
    { service: "auth-service",        count: 1842, rate: 14.2, delta: -8.1  },
    { service: "api-gateway",         count: 1024, rate: 6.8,  delta: +2.3  },
    { service: "payment-service",     count: 820,  rate: 9.1,  delta: -15.4 },
    { service: "user-service",        count: 614,  rate: 4.2,  delta: +1.1  },
    { service: "notification-service",count: 321,  rate: 3.7,  delta: -5.0  },
  ],
  by_type: [
    { type: "5xx Server Error",        count: 2104, pct: 43.6, sample_message: "Internal server error: connection pool exhausted" },
    { type: "Authentication Failure",  count: 1203, pct: 24.9, sample_message: "JWT verification failed: token expired" },
    { type: "4xx Client Error",        count: 891,  pct: 18.5, sample_message: "Resource not found: /api/v2/users/8821" },
    { type: "Timeout",                 count: 412,  pct:  8.5, sample_message: "Upstream timeout after 30000ms: payment-service" },
    { type: "Rate Limit Exceeded",     count: 211,  pct:  4.4, sample_message: "Rate limit exceeded: 1000 req/min from 10.0.4.21" },
  ],
};

/* ─── Traffic Summary ────────────────────────────────────────────────────── */
const hours24 = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);
const MOCK_TRAFFIC_SUMMARY: TrafficSummaryData = {
  total_requests: 574_230,
  avg_rps: 6.64,
  peak_rps: 42.1,
  peak_hour: "10:00",
  hourly: hours24.map((hour, i) => {
    const base = i >= 8 && i <= 18 ? 18000 : 4000;
    const total = Math.floor(base + Math.random() * 5000);
    return {
      hour,
      total,
      get:    Math.floor(total * 0.55),
      post:   Math.floor(total * 0.25),
      put:    Math.floor(total * 0.12),
      delete: Math.floor(total * 0.08),
    };
  }),
  by_method: [
    { method: "GET",    count: 315_827, color: "#7170ff" },
    { method: "POST",   count: 143_558, color: "#10b981" },
    { method: "PUT",    count:  68_908, color: "#f59e0b" },
    { method: "DELETE", count:  45_937, color: "#ef4444" },
  ],
};

/* ─── Log Distribution ───────────────────────────────────────────────────── */
const MOCK_LOG_DISTRIBUTION: LogDistributionData = {
  total_logs: 2_847_412,
  by_severity: [
    { name: "Info",     value: 1_702_480, color: "#38bdf8" },
    { name: "Debug",    value:   712_182, color: "#94a3b8" },
    { name: "Warning",  value:   284_741, color: "#f59e0b" },
    { name: "Error",    value:   113_896, color: "#f97316" },
    { name: "Critical", value:    34_113, color: "#ef4444" },
  ],
  by_service: SERVICES.map((service) => ({
    service,
    critical: Math.floor(Math.random() * 8000),
    error:    Math.floor(Math.random() * 28000),
    warning:  Math.floor(Math.random() * 60000),
    info:     Math.floor(300000 + Math.random() * 200000),
    debug:    Math.floor(100000 + Math.random() * 150000),
  })),
  hourly: hours24.map((hour, i) => ({
    hour,
    critical: Math.floor(Math.random() * 500 + (i >= 2 && i <= 5 ? 800 : 0)),
    error:    Math.floor(Math.random() * 2000 + 500),
    warning:  Math.floor(Math.random() * 6000 + 2000),
    info:     Math.floor(40000 + Math.random() * 30000),
    debug:    Math.floor(15000 + Math.random() * 15000),
  })),
};

/* ─── Mock fetch helpers ─────────────────────────────────────────────────── */
const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

export const fetchReports         = async () => { await delay(); return structuredClone(MOCK_REPORTS); };
export const fetchErrorSummary    = async () => { await delay(); return structuredClone(MOCK_ERROR_SUMMARY); };
export const fetchTrafficSummary  = async () => { await delay(); return structuredClone(MOCK_TRAFFIC_SUMMARY); };
export const fetchLogDistribution = async () => { await delay(); return structuredClone(MOCK_LOG_DISTRIBUTION); };
export const AVAILABLE_SERVICES   = SERVICES;
