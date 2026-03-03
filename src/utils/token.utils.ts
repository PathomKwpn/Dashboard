export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

/** Decode mock JWT (base64url header.payload.signature) */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    // base64url -> base64
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded));
    return payload as TokenPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;
  return Date.now() / 1000 > payload.exp;
};

export const ACCESS_TOKEN_KEY = "nx_access_token";
export const REFRESH_TOKEN_KEY = "nx_refresh_token";

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
