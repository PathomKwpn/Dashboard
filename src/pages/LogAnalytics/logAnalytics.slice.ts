import { createSlice } from "@reduxjs/toolkit";
import type { ErrorRateData, StatusCodeData, TopEndpoint, SlowEndpoint, UserAgentRow, ServicePerfRow } from "./logAnalytics.types";
import {
  fetchErrorRateThunk,
  fetchStatusCodesThunk,
  fetchTopEndpointsThunk,
  fetchSlowEndpointsThunk,
  fetchUserAgentsThunk,
  fetchServicePerfThunk,
} from "./logAnalytics.thunks";

interface LogAnalyticsState {
  errorRate:        ErrorRateData | null;
  statusCodes:      StatusCodeData | null;
  topEndpoints:     TopEndpoint[];
  slowEndpoints:    SlowEndpoint[];
  userAgents:       UserAgentRow[];
  servicePerf:      ServicePerfRow[];
  errorRateLoading:     boolean;
  statusCodesLoading:   boolean;
  topEndpointsLoading:  boolean;
  slowEndpointsLoading: boolean;
  userAgentsLoading:    boolean;
  servicePerfLoading:   boolean;
  error?: string;
}

const initialState: LogAnalyticsState = {
  errorRate:        null,
  statusCodes:      null,
  topEndpoints:     [],
  slowEndpoints:    [],
  userAgents:       [],
  servicePerf:      [],
  errorRateLoading:     false,
  statusCodesLoading:   false,
  topEndpointsLoading:  false,
  slowEndpointsLoading: false,
  userAgentsLoading:    false,
  servicePerfLoading:   false,
};

const logAnalyticsSlice = createSlice({
  name: "logAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Error Rate
      .addCase(fetchErrorRateThunk.pending, (s) => { s.errorRateLoading = true; s.error = undefined; })
      .addCase(fetchErrorRateThunk.fulfilled, (s, a) => { s.errorRate = a.payload; s.errorRateLoading = false; })
      .addCase(fetchErrorRateThunk.rejected, (s, a) => { s.errorRateLoading = false; s.error = a.payload as string; })
      // Status Codes
      .addCase(fetchStatusCodesThunk.pending, (s) => { s.statusCodesLoading = true; })
      .addCase(fetchStatusCodesThunk.fulfilled, (s, a) => { s.statusCodes = a.payload; s.statusCodesLoading = false; })
      .addCase(fetchStatusCodesThunk.rejected, (s, a) => { s.statusCodesLoading = false; s.error = a.payload as string; })
      // Top Endpoints
      .addCase(fetchTopEndpointsThunk.pending, (s) => { s.topEndpointsLoading = true; })
      .addCase(fetchTopEndpointsThunk.fulfilled, (s, a) => { s.topEndpoints = a.payload; s.topEndpointsLoading = false; })
      .addCase(fetchTopEndpointsThunk.rejected, (s, a) => { s.topEndpointsLoading = false; s.error = a.payload as string; })
      // Slow Endpoints
      .addCase(fetchSlowEndpointsThunk.pending, (s) => { s.slowEndpointsLoading = true; })
      .addCase(fetchSlowEndpointsThunk.fulfilled, (s, a) => { s.slowEndpoints = a.payload; s.slowEndpointsLoading = false; })
      .addCase(fetchSlowEndpointsThunk.rejected, (s, a) => { s.slowEndpointsLoading = false; s.error = a.payload as string; })
      // User Agents
      .addCase(fetchUserAgentsThunk.pending, (s) => { s.userAgentsLoading = true; })
      .addCase(fetchUserAgentsThunk.fulfilled, (s, a) => { s.userAgents = a.payload; s.userAgentsLoading = false; })
      .addCase(fetchUserAgentsThunk.rejected, (s, a) => { s.userAgentsLoading = false; s.error = a.payload as string; })
      // Service Perf
      .addCase(fetchServicePerfThunk.pending, (s) => { s.servicePerfLoading = true; })
      .addCase(fetchServicePerfThunk.fulfilled, (s, a) => { s.servicePerf = a.payload; s.servicePerfLoading = false; })
      .addCase(fetchServicePerfThunk.rejected, (s, a) => { s.servicePerfLoading = false; s.error = a.payload as string; });
  },
});

export default logAnalyticsSlice.reducer;
