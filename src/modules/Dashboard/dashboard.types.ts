/* ---------- Summary ---------- */
export interface DashboardSummary {
  total_events: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  last_updated: string; // ISO string
}

/* ---------- Time Series (Chart) ---------- */
export interface EventTimeSeries {
  timestamp: string; // ISO string
  events: number;
  severity?: "critical" | "high" | "medium" | "low";
}

/* ---------- Event List (Table) ---------- */
export interface EventItem {
  id: string;
  source_ip: string;
  target_ip: string;
  country: string;
  severity: "critical" | "high" | "medium" | "low";
  event_count: number;
  detected_at: string; // ISO string
}

/* ---------- API Generic ---------- */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
