export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "business";
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}
