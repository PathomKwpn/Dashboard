import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/utils/token.utils";
import { refreshTokenApi } from "@/services/auth.service";

// ─── Axios instance (used by all API calls) ───────────────────────────────────
export const apiClient = axios.create({
  baseURL: "/",
  timeout: 10000,
});

// ─── Request interceptor – attach access token ────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Refresh logic for axios-auth-refresh ────────────────────────────────────
const refreshAuthLogic = async (failedRequest: {
  response: { config: { headers: Record<string, string> } };
}) => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    window.location.href = "/login";
    return Promise.reject(new Error("No refresh token"));
  }

  try {
    const result = await refreshTokenApi(refreshToken);
    const storedRefresh = getRefreshToken()!;
    setTokens(result.accessToken, storedRefresh);
    // Retry the original request with the new token
    failedRequest.response.config.headers["Authorization"] =
      `Bearer ${result.accessToken}`;
    return Promise.resolve();
  } catch {
    clearTokens();
    window.location.href = "/login";
    return Promise.reject(new Error("Refresh failed"));
  }
};

// Intercept 401 responses and auto-refresh token
createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

// ─── Legacy helper (kept for backwards compatibility) ─────────────────────────
export const getAuthHeaders = (options?: { token?: boolean }) => {
  const headers: Record<string, string> = {};

  if (options?.token !== false) {
    const token = getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return { headers };
};
