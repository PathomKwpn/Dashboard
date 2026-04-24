import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchReports,
  fetchErrorSummary,
  fetchTrafficSummary,
  fetchLogDistribution,
} from "./logReport.thunks";
import type { LogReportState, Report } from "./logReport.types";

const initialState: LogReportState = {
  reports:              [],
  errorSummary:         null,
  trafficSummary:       null,
  logDistribution:      null,
  reportsLoading:       false,
  errorSummaryLoading:  false,
  trafficLoading:       false,
  distributionLoading:  false,
  error:                undefined,
};

const logReportSlice = createSlice({
  name: "logReport",
  initialState,
  reducers: {
    prependReport(s, a: PayloadAction<Report>) {
      s.reports.unshift(a.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // reports
      .addCase(fetchReports.pending,   (s)    => { s.reportsLoading = true; s.error = undefined; })
      .addCase(fetchReports.fulfilled, (s, a) => { s.reports = a.payload; s.reportsLoading = false; })
      .addCase(fetchReports.rejected,  (s, a) => { s.reportsLoading = false; s.error = a.payload as string; })
      // error summary
      .addCase(fetchErrorSummary.pending,   (s)    => { s.errorSummaryLoading = true; })
      .addCase(fetchErrorSummary.fulfilled, (s, a) => { s.errorSummary = a.payload; s.errorSummaryLoading = false; })
      .addCase(fetchErrorSummary.rejected,  (s, a) => { s.errorSummaryLoading = false; s.error = a.payload as string; })
      // traffic summary
      .addCase(fetchTrafficSummary.pending,   (s)    => { s.trafficLoading = true; })
      .addCase(fetchTrafficSummary.fulfilled, (s, a) => { s.trafficSummary = a.payload; s.trafficLoading = false; })
      .addCase(fetchTrafficSummary.rejected,  (s, a) => { s.trafficLoading = false; s.error = a.payload as string; })
      // log distribution
      .addCase(fetchLogDistribution.pending,   (s)    => { s.distributionLoading = true; })
      .addCase(fetchLogDistribution.fulfilled, (s, a) => { s.logDistribution = a.payload; s.distributionLoading = false; })
      .addCase(fetchLogDistribution.rejected,  (s, a) => { s.distributionLoading = false; s.error = a.payload as string; });
  },
});

export const { prependReport } = logReportSlice.actions;
export default logReportSlice.reducer;
