import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLogs } from "@/services/logExplorer.service";

export const fetchLogs = createAsyncThunk(
  "logExplorer/fetchLogs",
  async (_, { rejectWithValue }) => {
    try {
      return await getLogs();
    } catch {
      return rejectWithValue("Failed to fetch logs");
    }
  },
);
