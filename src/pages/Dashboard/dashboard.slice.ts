import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEventList,
  fetchEventTimeSeries,
  fetchSummary,
} from "./dashboard.thunks";
import type {
  DashboardSummary,
  EventItem,
  EventTimeSeries,
} from "./dashboard.types";

interface DashboardState {
  summary?: DashboardSummary;
  timeSeries: EventTimeSeries[];
  events: EventItem[];
  summaryLoading: boolean;
  timeSeriesLoading: boolean;
  eventsLoading: boolean;
  error?: string;
}

const initialState: DashboardState = {
  timeSeries: [],
  events: [],
  summaryLoading: false,
  timeSeriesLoading: false,
  eventsLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default dashboardSlice.reducer;
