import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEventList,
  fetchEventTimeSeries,
  fetchSummary,
  fetchLogLevelDistribution,
  fetchTopSourceIPs,
  fetchTopServices,
  fetchRecentAlerts,
} from "./dashboard.thunks";
import type {
  DashboardSummary,
  EventItem,
  EventTimeSeries,
  LogLevelItem,
  TopSourceIP,
  TopService,
  RecentAlert,
} from "./dashboard.types";

interface DashboardState {
  summary?: DashboardSummary;
  timeSeries: EventTimeSeries[];
  events: EventItem[];
  logLevelDistribution: LogLevelItem[];
  topSourceIPs: TopSourceIP[];
  topServices: TopService[];
  recentAlerts: RecentAlert[];
  summaryLoading: boolean;
  timeSeriesLoading: boolean;
  eventsLoading: boolean;
  logLevelLoading: boolean;
  topSourceIPsLoading: boolean;
  topServicesLoading: boolean;
  recentAlertsLoading: boolean;
  error?: string;
}

const initialState: DashboardState = {
  timeSeries: [],
  events: [],
  logLevelDistribution: [],
  topSourceIPs: [],
  topServices: [],
  recentAlerts: [],
  summaryLoading: false,
  timeSeriesLoading: false,
  eventsLoading: false,
  logLevelLoading: false,
  topSourceIPsLoading: false,
  topServicesLoading: false,
  recentAlertsLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchSummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = undefined;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
        state.summaryLoading = false;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = action.payload as string;
      })
      // Time Series
      .addCase(fetchEventTimeSeries.pending, (state) => {
        state.timeSeriesLoading = true;
        state.error = undefined;
      })
      .addCase(fetchEventTimeSeries.fulfilled, (state, action) => {
        state.timeSeries = action.payload;
        state.timeSeriesLoading = false;
      })
      .addCase(fetchEventTimeSeries.rejected, (state, action) => {
        state.timeSeriesLoading = false;
        state.error = action.payload as string;
      })
      // Event List (legacy)
      .addCase(fetchEventList.pending, (state) => {
        state.eventsLoading = true;
        state.error = undefined;
      })
      .addCase(fetchEventList.fulfilled, (state, action) => {
        state.events = action.payload;
        state.eventsLoading = false;
      })
      .addCase(fetchEventList.rejected, (state, action) => {
        state.eventsLoading = false;
        state.error = action.payload as string;
      })
      // Log Level Distribution
      .addCase(fetchLogLevelDistribution.pending, (state) => {
        state.logLevelLoading = true;
      })
      .addCase(fetchLogLevelDistribution.fulfilled, (state, action) => {
        state.logLevelDistribution = action.payload;
        state.logLevelLoading = false;
      })
      .addCase(fetchLogLevelDistribution.rejected, (state, action) => {
        state.logLevelLoading = false;
        state.error = action.payload as string;
      })
      // Top Source IPs
      .addCase(fetchTopSourceIPs.pending, (state) => {
        state.topSourceIPsLoading = true;
      })
      .addCase(fetchTopSourceIPs.fulfilled, (state, action) => {
        state.topSourceIPs = action.payload;
        state.topSourceIPsLoading = false;
      })
      .addCase(fetchTopSourceIPs.rejected, (state, action) => {
        state.topSourceIPsLoading = false;
        state.error = action.payload as string;
      })
      // Top Services
      .addCase(fetchTopServices.pending, (state) => {
        state.topServicesLoading = true;
      })
      .addCase(fetchTopServices.fulfilled, (state, action) => {
        state.topServices = action.payload;
        state.topServicesLoading = false;
      })
      .addCase(fetchTopServices.rejected, (state, action) => {
        state.topServicesLoading = false;
        state.error = action.payload as string;
      })
      // Recent Alerts
      .addCase(fetchRecentAlerts.pending, (state) => {
        state.recentAlertsLoading = true;
      })
      .addCase(fetchRecentAlerts.fulfilled, (state, action) => {
        state.recentAlerts = action.payload;
        state.recentAlertsLoading = false;
      })
      .addCase(fetchRecentAlerts.rejected, (state, action) => {
        state.recentAlertsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
