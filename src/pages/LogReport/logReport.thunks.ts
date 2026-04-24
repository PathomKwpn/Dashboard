import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getReports,
  getErrorSummary,
  getTrafficSummary,
  getLogDistribution,
} from "@/services/logReport.service";

const thunk = <T>(name: string, fn: () => Promise<T>) =>
  createAsyncThunk(`logReport/${name}`, async (_, { rejectWithValue }) => {
    try { return await fn(); }
    catch { return rejectWithValue(`Failed to fetch ${name}`); }
  });

export const fetchReports         = thunk("fetchReports",        getReports);
export const fetchErrorSummary    = thunk("fetchErrorSummary",   getErrorSummary);
export const fetchTrafficSummary  = thunk("fetchTrafficSummary", getTrafficSummary);
export const fetchLogDistribution = thunk("fetchLogDistribution",getLogDistribution);
