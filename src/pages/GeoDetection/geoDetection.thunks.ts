import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getGeoSummary,
  getAttackOrigins,
  getSuspiciousIPs,
  getAttacksByCountry,
  getDetectionEvents,
} from "@/services/geoDetection.service";

const thunk = <T>(name: string, fn: () => Promise<T>) =>
  createAsyncThunk(`geoDetection/${name}`, async (_, { rejectWithValue }) => {
    try { return await fn(); }
    catch { return rejectWithValue(`Failed to fetch ${name}`); }
  });

export const fetchGeoSummary        = thunk("fetchGeoSummary",        getGeoSummary);
export const fetchAttackOrigins     = thunk("fetchAttackOrigins",     getAttackOrigins);
export const fetchSuspiciousIPs     = thunk("fetchSuspiciousIPs",     getSuspiciousIPs);
export const fetchAttacksByCountry  = thunk("fetchAttacksByCountry",  getAttacksByCountry);
export const fetchDetectionEvents   = thunk("fetchDetectionEvents",   getDetectionEvents);
