import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loginThunk,
  logoutThunk,
  refreshAccessTokenThunk,
} from "@/pages/Auth/auth.thunks";
import { clearError } from "@/pages/Auth/auth.slice";
import type { LoginCredentials } from "@/pages/Auth/auth.types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const login = (credentials: LoginCredentials) =>
    dispatch(loginThunk(credentials));

  const logout = () => dispatch(logoutThunk());

  const refreshToken = () => dispatch(refreshAccessTokenThunk());

  const resetError = () => dispatch(clearError());

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    isInitialized: auth.isInitialized,
    login,
    logout,
    refreshToken,
    resetError,
  };
};
