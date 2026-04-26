import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchErrorRate,
  fetchStatusCodes,
  fetchTopEndpoints,
  fetchSlowEndpoints,
  fetchUserAgents,
  fetchServicePerf,
} from "./logAnalytics.mock";

const thunk = <T>(name: string, fn: () => Promise<T>) =>
  createAsyncThunk(`logAnalytics/${name}`, async (_, { rejectWithValue }) => {
    try { return await fn(); }
    catch { return rejectWithValue(`Failed to fetch ${name}`); }
  });

export const fetchErrorRateThunk     = thunk("fetchErrorRate",     fetchErrorRate);
export const fetchStatusCodesThunk   = thunk("fetchStatusCodes",   fetchStatusCodes);
export const fetchTopEndpointsThunk  = thunk("fetchTopEndpoints",  fetchTopEndpoints);
export const fetchSlowEndpointsThunk = thunk("fetchSlowEndpoints", fetchSlowEndpoints);
export const fetchUserAgentsThunk    = thunk("fetchUserAgents",    fetchUserAgents);
export const fetchServicePerfThunk   = thunk("fetchServicePerf",   fetchServicePerf);
