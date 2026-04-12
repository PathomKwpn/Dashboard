import type {
  ErrorRateData, StatusCodeData, TopEndpoint, SlowEndpoint,
  UserAgentRow, ServicePerfRow,
} from "./logAnalytics.types";

/* ─── Error Rate ─────────────────────────────────────────────────────────── */
const MOCK_ERROR_RATE: ErrorRateData = {
  current_rate: 8.4,
  avg_rate:     6.2,
  max_rate:     21.7,
  sla_breaches: 3,
  series: Array.from({ length: 48 }, (_, i) => {
    const hour = i * 0.5;
    const spike = (i === 18 || i === 32) ? 15 : 0;
    return {
      time:       `${String(Math.floor(hour)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`,
      error_rate: Math.max(0, Math.min(30, 5 + Math.random() * 6 + spike)),
      threshold:  10,
    };
  }),
};

/* ─── Status Code Distribution ───────────────────────────────────────────── */
const MOCK_STATUS_CODE: StatusCodeData = {
  total: 574_230,
  groups: [
    { name: "2xx", label: "Success",      value: 489_420, color: "#10b981" },
    { name: "3xx", label: "Redirect",     value:  31_082, color: "#38bdf8" },
    { name: "4xx", label: "Client Error", value:  38_947, color: "#f59e0b" },
    { name: "5xx", label: "Server Error", value:  14_781, color: "#ef4444" },
  ],
  by_service: [
    { service: "auth-service",         "2xx": 98_200,  "3xx": 4_100, "4xx": 12_400, "5xx": 6_200  },
    { service: "api-gateway",          "2xx": 142_800, "3xx": 9_800, "4xx": 11_200, "5xx": 3_400  },
    { service: "user-service",         "2xx": 87_600,  "3xx": 6_200, "4xx": 7_800,  "5xx": 2_100  },
    { service: "payment-service",      "2xx": 94_100,  "3xx": 5_400, "4xx": 4_900,  "5xx": 1_800  },
    { service: "notification-service", "2xx": 66_720,  "3xx": 5_582, "4xx": 2_647,  "5xx": 1_281  },
  ],
};

/* ─── Top Endpoints ──────────────────────────────────────────────────────── */
const MOCK_TOP_ENDPOINTS: TopEndpoint[] = [
  { rank: 1, method: "GET",    path: "/api/v2/users",             service: "user-service",         count: 84_200, avg_ms: 42,  p95_ms: 98,   error_rate: 0.4  },
  { rank: 2, method: "POST",   path: "/api/v2/auth/login",        service: "auth-service",         count: 62_410, avg_ms: 118, p95_ms: 342,  error_rate: 14.2 },
  { rank: 3, method: "GET",    path: "/api/v2/events",            service: "api-gateway",          count: 51_820, avg_ms: 67,  p95_ms: 184,  error_rate: 1.2  },
  { rank: 4, method: "POST",   path: "/api/v2/payments/charge",   service: "payment-service",      count: 38_940, avg_ms: 284, p95_ms: 820,  error_rate: 9.1  },
  { rank: 5, method: "GET",    path: "/api/v2/notifications",     service: "notification-service", count: 31_640, avg_ms: 38,  p95_ms: 88,   error_rate: 0.6  },
  { rank: 6, method: "PUT",    path: "/api/v2/users/:id",         service: "user-service",         count: 28_110, avg_ms: 95,  p95_ms: 230,  error_rate: 2.1  },
  { rank: 7, method: "GET",    path: "/api/v2/logs",              service: "api-gateway",          count: 24_820, avg_ms: 210, p95_ms: 640,  error_rate: 0.8  },
  { rank: 8, method: "DELETE", path: "/api/v2/sessions/:id",      service: "auth-service",         count: 18_340, avg_ms: 55,  p95_ms: 142,  error_rate: 0.3  },
  { rank: 9, method: "POST",   path: "/api/v2/notifications/send",service: "notification-service", count: 14_820, avg_ms: 165, p95_ms: 480,  error_rate: 3.8  },
  { rank: 10,method: "PATCH",  path: "/api/v2/payments/:id",      service: "payment-service",      count: 10_220, avg_ms: 198, p95_ms: 542,  error_rate: 5.6  },
];

/* ─── Slow Endpoints ─────────────────────────────────────────────────────── */
const MOCK_SLOW_ENDPOINTS: SlowEndpoint[] = [
  { rank: 1, method: "POST",  path: "/api/v2/payments/charge",      service: "payment-service",      p50_ms: 284, p95_ms: 820,  p99_ms: 2140,  count: 38_940 },
  { rank: 2, method: "GET",   path: "/api/v2/logs",                  service: "api-gateway",          p50_ms: 210, p95_ms: 640,  p99_ms: 1820,  count: 24_820 },
  { rank: 3, method: "POST",  path: "/api/v2/auth/login",            service: "auth-service",         p50_ms: 118, p95_ms: 342,  p99_ms: 980,   count: 62_410 },
  { rank: 4, method: "POST",  path: "/api/v2/notifications/send",    service: "notification-service", p50_ms: 165, p95_ms: 480,  p99_ms: 1240,  count: 14_820 },
  { rank: 5, method: "PATCH", path: "/api/v2/payments/:id",          service: "payment-service",      p50_ms: 198, p95_ms: 542,  p99_ms: 1180,  count: 10_220 },
  { rank: 6, method: "GET",   path: "/api/v2/reports/generate",      service: "api-gateway",          p50_ms: 182, p95_ms: 510,  p99_ms: 1640,  count: 4_210  },
  { rank: 7, method: "PUT",   path: "/api/v2/users/:id",             service: "user-service",         p50_ms: 95,  p95_ms: 230,  p99_ms: 640,   count: 28_110 },
  { rank: 8, method: "POST",  path: "/api/v2/auth/token/refresh",    service: "auth-service",         p50_ms: 84,  p95_ms: 210,  p99_ms: 580,   count: 9_840  },
];

/* ─── User Agent ─────────────────────────────────────────────────────────── */
const MOCK_USER_AGENTS: UserAgentRow[] = [
  { rank: 1, agent: "Chrome 124 / Windows",  type: "browser", count: 182_430, pct: 31.8, color: "#7170ff" },
  { rank: 2, agent: "Internal API Client",    type: "api",     count: 142_180, pct: 24.8, color: "#10b981" },
  { rank: 3, agent: "Chrome 124 / macOS",     type: "browser", count:  98_640, pct: 17.2, color: "#38bdf8" },
  { rank: 4, agent: "Safari / iOS 17",        type: "mobile",  count:  62_410, pct: 10.9, color: "#f59e0b" },
  { rank: 5, agent: "Datadog Agent 7.x",      type: "bot",     count:  41_820, pct:  7.3, color: "#94a3b8" },
  { rank: 6, agent: "Firefox 125 / Linux",    type: "browser", count:  24_110, pct:  4.2, color: "#c084fc" },
  { rank: 7, agent: "Chrome / Android 14",    type: "mobile",  count:  14_640, pct:  2.6, color: "#fb7185" },
  { rank: 8, agent: "curl / 7.88",            type: "api",     count:   4_820, pct:  0.8, color: "#64748b" },
  { rank: 9, agent: "Prometheus / 2.48",      type: "bot",     count:   3_180, pct:  0.4, color: "#64748b" },
];

/* ─── Service Performance ────────────────────────────────────────────────── */
const sparkline = (base: number, noise: number) =>
  Array.from({ length: 12 }, () => Math.max(0, base + (Math.random() - 0.5) * noise));

const MOCK_SERVICE_PERF: ServicePerfRow[] = [
  { service: "api-gateway",          rps: 18.4, avg_latency: 67,  p95_latency: 184, error_rate: 1.2,  uptime: 99.98, status: "healthy",  trend: sparkline(67, 20)  },
  { service: "auth-service",         rps: 12.1, avg_latency: 118, p95_latency: 342, error_rate: 14.2, uptime: 99.82, status: "critical", trend: sparkline(118, 60) },
  { service: "user-service",         rps: 9.8,  avg_latency: 72,  p95_latency: 210, error_rate: 2.8,  uptime: 99.95, status: "healthy",  trend: sparkline(72, 25)  },
  { service: "payment-service",      rps: 7.4,  avg_latency: 248, p95_latency: 720, error_rate: 9.1,  uptime: 99.71, status: "warning",  trend: sparkline(248, 80) },
  { service: "notification-service", rps: 4.9,  avg_latency: 58,  p95_latency: 148, error_rate: 1.8,  uptime: 99.91, status: "healthy",  trend: sparkline(58, 18)  },
];

/* ─── Mock fetch helpers ─────────────────────────────────────────────────── */
const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

export const fetchErrorRate       = async () => { await delay(); return structuredClone(MOCK_ERROR_RATE); };
export const fetchStatusCodes     = async () => { await delay(); return structuredClone(MOCK_STATUS_CODE); };
export const fetchTopEndpoints    = async () => { await delay(); return structuredClone(MOCK_TOP_ENDPOINTS); };
export const fetchSlowEndpoints   = async () => { await delay(); return structuredClone(MOCK_SLOW_ENDPOINTS); };
export const fetchUserAgents      = async () => { await delay(); return structuredClone(MOCK_USER_AGENTS); };
export const fetchServicePerf     = async () => { await delay(); return structuredClone(MOCK_SERVICE_PERF); };
