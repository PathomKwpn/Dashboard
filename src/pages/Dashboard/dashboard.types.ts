/* ---------- Shared ---------- */
export type RiskLevel = "critical" | "high" | "medium" | "low";
export type ServiceStatus = "healthy" | "warning" | "critical";
export type AlertStatus = "open" | "ack" | "resolved";

/* ---------- 1. KPI Summary ---------- */
export interface DashboardSummary {
  /** @deprecated use total_logs */
  total_events?: number;
  total_logs: number;
  critical_alerts: number;
  error_rate: number;
  avg_response_ms: number;
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  changes: {
    total_logs: number;
    critical_alerts: number;
    error_rate: number;
    avg_response_ms: number;
  };
  last_updated: string; // ISO string
}

/* ---------- 2. Log Volume Trend (Line Chart) ---------- */
export interface EventTimeSeries {
  detect_time: string; // ISO string
  events: number;
  avg_24h: number;
  risk_level: RiskLevel;
}

/* ---------- 3. Log Level Distribution (Pie Chart) ---------- */
export interface LogLevelItem {
  name: string;
  value: number;
}

/* ---------- 4. Top Source IPs ---------- */
export interface TopSourceIP {
  rank: number;
  source_ip: string;
  country: string;
  log_count: number;
  threat_level: RiskLevel;
}

/* ---------- 5. Top Services ---------- */
export interface TopService {
  rank: number;
  service: string;
  log_count: number;
  error_count: number;
  error_rate: number;
  status: ServiceStatus;
}

/* ---------- 6. Recent Alerts ---------- */
export interface RecentAlert {
  id: string;
  timestamp: string; // ISO string
  severity: RiskLevel;
  source_ip: string;
  service: string;
  message: string;
  status: AlertStatus;
}

/* ---------- Legacy Event List (kept for backward compat) ---------- */
export interface EventItem {
  id: string;
  detect_time: string;
  risk_level: RiskLevel;
  source_ip: string;
  country: string;
  events: number;
  diff: number;
  growth_percent: number;
  message: string;
}

/* ---------- API Generic ---------- */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
