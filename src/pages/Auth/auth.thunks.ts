import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  logoutApi,
  refreshTokenApi,
  getMeApi,
} from "@/services/auth.service";
import type { LoginCredentials } from "@/pages/Auth/auth.types";
import {
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "@/utils/token.utils";

/** Login thunk – calls mock API, persists tokens, returns user */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      return response;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      return rejectWithValue(message);
    }
  },
);

/** Logout thunk – revokes refresh token, clears storage */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
      clearTokens();
    } catch (err: unknown) {
      // Even if the server call fails, clear local tokens
      clearTokens();
      const message = err instanceof Error ? err.message : "Logout failed";
      return rejectWithValue(message);
    }
  },
);

/** Refresh access token thunk */
export const refreshAccessTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");
      const response = await refreshTokenApi(refreshToken);
      // Update only access token in storage
      const storedRefresh = getRefreshToken()!;
      setTokens(response.accessToken, storedRefresh);
      return response;
    } catch (err: unknown) {
      clearTokens();
      const message = err instanceof Error ? err.message : "Token refresh failed";
      return rejectWithValue(message);
    }
  },
);

/** Initialize auth – restores session from stored tokens on app load */
export const initializeAuthThunk = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        return null; // No session to restore
      }

      // Try to get current user; if access token expired, try refresh first
      try {
        const user = await getMeApi(accessToken);
        return { user, accessToken, refreshToken };
      } catch {
        // Access token might be expired – try refreshing
        const refreshed = await refreshTokenApi(refreshToken);
        setTokens(refreshed.accessToken, refreshToken);
        const user = await getMeApi(refreshed.accessToken);
        return { user, accessToken: refreshed.accessToken, refreshToken };
      }
    } catch (err: unknown) {
      clearTokens();
      const message = err instanceof Error ? err.message : "Session restore failed";
      return rejectWithValue(message);
    }
  },
);
