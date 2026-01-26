import { createSlice } from "@reduxjs/toolkit";
import { fetchSummary } from "./dashboardThunks";
import type { DashboardSummary } from "./dashboard.types";

interface DashboardState {
  summary?: DashboardSummary;
  loading: boolean;
  error?: string;
}

const initialState: DashboardState = {
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
        state.loading = false;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
