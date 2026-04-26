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
import {
  DASHBOARD_SUMMARY_API,
  DASHBOARD_EVENTS_TIMESERIES_API,
  DASHBOARD_EVENTS_API,
  DASHBOARD_LOG_LEVELS_API,
  DASHBOARD_TOP_IPS_API,
  DASHBOARD_TOP_SERVICES_API,
  DASHBOARD_ALERTS_API,
} from "@/config/endpoints";

export const getDashboardSummary = async () => {
  const res = await axios.get(DASHBOARD_SUMMARY_API);
  return res.data as DashboardSummary;
};

export const getEventTimeSeries = async () => {
  const res = await axios.get(DASHBOARD_EVENTS_TIMESERIES_API);
  return res.data as EventTimeSeries[];
};

export const getEventList = async () => {
  const res = await axios.get(DASHBOARD_EVENTS_API);
  return res.data as EventItem[];
};

export const getLogLevelDistribution = async () => {
  const res = await axios.get(DASHBOARD_LOG_LEVELS_API);
  return res.data as LogLevelItem[];
};

export const getTopSourceIPs = async () => {
  const res = await axios.get(DASHBOARD_TOP_IPS_API);
  return res.data as TopSourceIP[];
};

export const getTopServices = async () => {
  const res = await axios.get(DASHBOARD_TOP_SERVICES_API);
  return res.data as TopService[];
};

export const getRecentAlerts = async () => {
  const res = await axios.get(DASHBOARD_ALERTS_API);
  return res.data as RecentAlert[];
};
