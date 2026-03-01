import axios from "axios";
import type {
  DashboardSummary,
  EventItem,
  EventTimeSeries,
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
