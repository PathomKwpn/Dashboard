import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDashboardSummary,
  getEventList,
  getEventTimeSeries,
  getLogLevelDistribution,
  getTopSourceIPs,
  getTopServices,
  getRecentAlerts,
} from "@/services/dashboard.service";

export const fetchSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      return await getDashboardSummary();
    } catch {
      return rejectWithValue("Fetch summary failed");
    }
  },
);

export const fetchEventTimeSeries = createAsyncThunk(
  "dashboard/fetchEventTimeSeries",
  async (_, { rejectWithValue }) => {
    try {
      return await getEventTimeSeries();
    } catch {
      return rejectWithValue("Fetch event time series failed");
    }
  },
);

export const fetchEventList = createAsyncThunk(
  "dashboard/fetchEventList",
  async (_, { rejectWithValue }) => {
    try {
      return await getEventList();
    } catch {
      return rejectWithValue("Fetch event list failed");
    }
  },
);

export const fetchLogLevelDistribution = createAsyncThunk(
  "dashboard/fetchLogLevelDistribution",
  async (_, { rejectWithValue }) => {
    try {
      return await getLogLevelDistribution();
    } catch {
      return rejectWithValue("Fetch log level distribution failed");
    }
  },
);

export const fetchTopSourceIPs = createAsyncThunk(
  "dashboard/fetchTopSourceIPs",
  async (_, { rejectWithValue }) => {
    try {
      return await getTopSourceIPs();
    } catch {
      return rejectWithValue("Fetch top source IPs failed");
    }
  },
);

export const fetchTopServices = createAsyncThunk(
  "dashboard/fetchTopServices",
  async (_, { rejectWithValue }) => {
    try {
      return await getTopServices();
    } catch {
      return rejectWithValue("Fetch top services failed");
    }
  },
);

export const fetchRecentAlerts = createAsyncThunk(
  "dashboard/fetchRecentAlerts",
  async (_, { rejectWithValue }) => {
    try {
      return await getRecentAlerts();
    } catch {
      return rejectWithValue("Fetch recent alerts failed");
    }
  },
);
