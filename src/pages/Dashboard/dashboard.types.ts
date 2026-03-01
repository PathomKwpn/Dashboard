/* ---------- Summary ---------- */
export type RiskLevel = "critical" | "high" | "medium" | "low";

export interface DashboardSummary {
  total_events: number;
  severity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  last_updated: string; // ISO string
}

/* ---------- Time Series (Chart) ---------- */
export interface EventTimeSeries {
  detect_time: string; // ISO string
  events: number;
  avg_24h: number;
  risk_level: RiskLevel;
}

/* ---------- Event List (Table) ---------- */
export interface EventItem {
  id: string;
  detect_time: string; // ISO string
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
