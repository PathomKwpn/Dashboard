import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDashboardSummary,
  getEventList,
  getEventTimeSeries,
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
