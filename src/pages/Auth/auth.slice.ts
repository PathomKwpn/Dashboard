import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./auth.types";
import {
  loginThunk,
  logoutThunk,
  refreshAccessTokenThunk,
  initializeAuthThunk,
} from "./auth.thunks";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Initialize ────────────────────────────────────────────────────────
    builder
      .addCase(initializeAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.isInitialized = false;
      })
      .addCase(initializeAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuthThunk.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });

    // ── Login ─────────────────────────────────────────────────────────────
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // ── Logout ────────────────────────────────────────────────────────────
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        return { ...initialState, isInitialized: true };
      })
      .addCase(logoutThunk.rejected, (state) => {
        // Force logout even on error
        return { ...initialState, isInitialized: true };
      });

    // ── Refresh Token ─────────────────────────────────────────────────────
    builder
      .addCase(refreshAccessTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshAccessTokenThunk.rejected, (state) => {
        return { ...initialState, isInitialized: true };
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
