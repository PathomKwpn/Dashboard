import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardSummary } from "@/services/dashboard.service";

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
