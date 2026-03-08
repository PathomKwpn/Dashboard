import axios from "axios";
import type {
  DashboardSummary,
  EventItem,
  EventTimeSeries,
  LogLevelItem,
  TopSourceIP,
  TopService,
  RecentAlert,
} from "@/pages/Dashboard/dashboard.types";

export const getDashboardSummary = async () => {
  const res = await axios.get("/mock/summary.json");
  return res.data as DashboardSummary;
};

export const getEventTimeSeries = async () => {
  const res = await axios.get("/mock/events_timeseries.json");
  return res.data as EventTimeSeries[];
};

export const getEventList = async () => {
  const res = await axios.get("/mock/events_list.json");
  return res.data as EventItem[];
};

export const getLogLevelDistribution = async () => {
  const res = await axios.get("/mock/log_level_distribution.json");
  return res.data as LogLevelItem[];
};

export const getTopSourceIPs = async () => {
  const res = await axios.get("/mock/top_source_ips.json");
  return res.data as TopSourceIP[];
};

export const getTopServices = async () => {
  const res = await axios.get("/mock/top_services.json");
  return res.data as TopService[];
};

export const getRecentAlerts = async () => {
  const res = await axios.get("/mock/recent_alerts.json");
  return res.data as RecentAlert[];
};
