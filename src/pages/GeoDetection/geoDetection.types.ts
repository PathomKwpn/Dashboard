/* ─── Enums ─────────────────────────────────────────────────────────────── */
export type RiskLevel      = "critical" | "high" | "medium" | "low";
export type AttackType     = "brute_force" | "ddos" | "sql_injection" | "port_scan" | "credential_stuffing" | "anomaly" | "xss";
export type DetectionAction = "blocked" | "alerted" | "monitoring";
export type IPStatus       = "blocked" | "monitoring" | "whitelisted";

/* ─── Summary KPIs ──────────────────────────────────────────────────────── */
export interface GeoSummary {
  total_events:       number;
  suspicious_ips:     number;
  countries_detected: number;
  blocked_attacks:    number;
  changes: {
    total_events:       number;
    suspicious_ips:     number;
    countries_detected: number;
    blocked_attacks:    number;
  };
  last_updated: string;
}

/* ─── Geo Map Marker ────────────────────────────────────────────────────── */
export interface AttackOrigin {
  country:       string;
  country_code:  string;
  lat:           number;
  lng:           number;
  attack_count:  number;
  threat_level:  RiskLevel;
  blocked_count: number;
}

/* ─── Suspicious IP Table ───────────────────────────────────────────────── */
export interface SuspiciousIP {
  rank:          number;
  source_ip:     string;
  country:       string;
  country_code:  string;
  attack_count:  number;
  last_seen:     string;
  threat_level:  RiskLevel;
  attack_type:   AttackType;
  status:        IPStatus;
}

/* ─── Attack by Country Bar Chart ──────────────────────────────────────── */
export interface AttackByCountry {
  country:      string;
  country_code: string;
  total:        number;
  blocked:      number;
  passed:       number;
}

/* ─── Detection Events Table ────────────────────────────────────────────── */
export interface DetectionEvent {
  id:               string;
  timestamp:        string;
  source_ip:        string;
  country:          string;
  country_code:     string;
  detection_type:   AttackType;
  severity:         RiskLevel;
  target_endpoint:  string;
  description:      string;
  action_taken:     DetectionAction;
  confidence:       number;
}

/* ─── Redux State ───────────────────────────────────────────────────────── */
export interface GeoDetectionState {
  summary?:          GeoSummary;
  attackOrigins:     AttackOrigin[];
  suspiciousIPs:     SuspiciousIP[];
  attacksByCountry:  AttackByCountry[];
  detectionEvents:   DetectionEvent[];

  summaryLoading:    boolean;
  originsLoading:    boolean;
  ipsLoading:        boolean;
  countriesLoading:  boolean;
  eventsLoading:     boolean;
  error?:            string;
}
