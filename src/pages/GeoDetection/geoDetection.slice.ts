import { createSlice } from "@reduxjs/toolkit";
import {
  fetchGeoSummary,
  fetchAttackOrigins,
  fetchSuspiciousIPs,
  fetchAttacksByCountry,
  fetchDetectionEvents,
} from "./geoDetection.thunks";
import type { GeoDetectionState } from "./geoDetection.types";

const initialState: GeoDetectionState = {
  attackOrigins:    [],
  suspiciousIPs:    [],
  attacksByCountry: [],
  detectionEvents:  [],
  summaryLoading:   false,
  originsLoading:   false,
  ipsLoading:       false,
  countriesLoading: false,
  eventsLoading:    false,
};

const addCases = <T>(
  builder: ReturnType<typeof createSlice>["getInitialState"] extends never ? never : Parameters<Parameters<typeof createSlice>[0]["extraReducers"]>[0],
  thunk: { pending: { type: string }; fulfilled: { type: string }; rejected: { type: string } },
  loadingKey: keyof GeoDetectionState,
  dataKey: keyof GeoDetectionState,
) => {
  (builder as any)
    .addCase((thunk as any).pending,   (s: GeoDetectionState) => { (s as any)[loadingKey] = true; s.error = undefined; })
    .addCase((thunk as any).fulfilled, (s: GeoDetectionState, a: any) => { (s as any)[dataKey] = a.payload; (s as any)[loadingKey] = false; })
    .addCase((thunk as any).rejected,  (s: GeoDetectionState, a: any) => { (s as any)[loadingKey] = false; s.error = a.payload as string; });
};

const geoDetectionSlice = createSlice({
  name: "geoDetection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(fetchGeoSummary.pending,   (s) => { s.summaryLoading = true; s.error = undefined; })
      .addCase(fetchGeoSummary.fulfilled, (s, a) => { s.summary = a.payload; s.summaryLoading = false; })
      .addCase(fetchGeoSummary.rejected,  (s, a) => { s.summaryLoading = false; s.error = a.payload as string; })
    // Attack origins
      .addCase(fetchAttackOrigins.pending,   (s) => { s.originsLoading = true; })
      .addCase(fetchAttackOrigins.fulfilled, (s, a) => { s.attackOrigins = a.payload; s.originsLoading = false; })
      .addCase(fetchAttackOrigins.rejected,  (s, a) => { s.originsLoading = false; s.error = a.payload as string; })
    // Suspicious IPs
      .addCase(fetchSuspiciousIPs.pending,   (s) => { s.ipsLoading = true; })
      .addCase(fetchSuspiciousIPs.fulfilled, (s, a) => { s.suspiciousIPs = a.payload; s.ipsLoading = false; })
      .addCase(fetchSuspiciousIPs.rejected,  (s, a) => { s.ipsLoading = false; s.error = a.payload as string; })
    // Attacks by country
      .addCase(fetchAttacksByCountry.pending,   (s) => { s.countriesLoading = true; })
      .addCase(fetchAttacksByCountry.fulfilled, (s, a) => { s.attacksByCountry = a.payload; s.countriesLoading = false; })
      .addCase(fetchAttacksByCountry.rejected,  (s, a) => { s.countriesLoading = false; s.error = a.payload as string; })
    // Detection events
      .addCase(fetchDetectionEvents.pending,   (s) => { s.eventsLoading = true; })
      .addCase(fetchDetectionEvents.fulfilled, (s, a) => { s.detectionEvents = a.payload; s.eventsLoading = false; })
      .addCase(fetchDetectionEvents.rejected,  (s, a) => { s.eventsLoading = false; s.error = a.payload as string; });
  },
});

export default geoDetectionSlice.reducer;
