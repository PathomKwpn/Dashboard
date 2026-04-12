/* ─── Error Rate ─────────────────────────────────────────────────────────── */
export type ErrorRatePoint = {
  time: string;
  error_rate: number;
  threshold: number;
};

export type ErrorRateData = {
  current_rate: number;
  avg_rate: number;
  max_rate: number;
  sla_breaches: number;
  series: ErrorRatePoint[];
};

/* ─── Status Code Distribution ───────────────────────────────────────────── */
export type StatusCodeGroup = {
  name: string;
  label: string;
  value: number;
  color: string;
};

export type StatusByService = {
  service: string;
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
};

export type StatusCodeData = {
  total: number;
  groups: StatusCodeGroup[];
  by_service: StatusByService[];
};

/* ─── Top Endpoints ──────────────────────────────────────────────────────── */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type TopEndpoint = {
  rank: number;
  method: HttpMethod;
  path: string;
  service: string;
  count: number;
  avg_ms: number;
  p95_ms: number;
  error_rate: number;
};

/* ─── Slow Endpoints ─────────────────────────────────────────────────────── */
export type SlowEndpoint = {
  rank: number;
  method: HttpMethod;
  path: string;
  service: string;
  p50_ms: number;
  p95_ms: number;
  p99_ms: number;
  count: number;
};

/* ─── User Agent ─────────────────────────────────────────────────────────── */
export type AgentType = "browser" | "mobile" | "bot" | "api";

export type UserAgentRow = {
  rank: number;
  agent: string;
  type: AgentType;
  count: number;
  pct: number;
  color: string;
};

/* ─── Service Performance ────────────────────────────────────────────────── */
export type ServiceStatus = "healthy" | "warning" | "critical";

export type ServicePerfRow = {
  service: string;
  rps: number;
  avg_latency: number;
  p95_latency: number;
  error_rate: number;
  uptime: number;
  status: ServiceStatus;
  trend: number[]; // mini sparkline (last 12 values)
};
