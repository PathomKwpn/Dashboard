/**
 * Mock Auth Service
 * Simulates a real backend auth API with:
 *  - Login (email + password)
 *  - Token refresh
 *  - Logout (revoke)
 *
 * Access Token  expires in 15 minutes
 * Refresh Token expires in 7 days
 */
import type {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  User,
} from "@/pages/Auth/auth.types";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_USERS: Record<string, User> = {
  "admin@pathom.com": {
    id: "usr_001",
    email: "admin@pathom.com",
    name: "Admin Pathom",
    role: "admin",
  },
  "user@pathom.com": {
    id: "usr_002",
    email: "user@pathom.com",
    name: "Young Alasła",
    role: "business",
  },
  "dev@pathom.com": {
    id: "usr_003",
    email: "dev@pathom.com",
    name: "Dev User",
    role: "user",
  },
};

const MOCK_PASSWORDS: Record<string, string> = {
  "admin@pathom.com": "admin123",
  "user@pathom.com": "password123",
  "dev@pathom.com": "dev123",
};

// Track revoked refresh tokens (simulate DB)
const revokedTokens = new Set<string>();

// ─── Token Helpers ────────────────────────────────────────────────────────────

const toBase64Url = (str: string): string =>
  btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

const createMockJWT = (
  payload: Record<string, unknown>,
  expiresInSeconds: number,
): string => {
  const header = toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = toBase64Url(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    }),
  );
  // Mock signature (not cryptographically valid – purely for simulation)
  const signature = toBase64Url(`nx-mock-sig-${Date.now()}`);
  return `${header}.${fullPayload}.${signature}`;
};

const generateTokens = (user: User) => {
  const accessToken = createMockJWT(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    15 * 60, // 15 min
  );
  const refreshToken = createMockJWT(
    { sub: user.id, type: "refresh" },
    7 * 24 * 60 * 60, // 7 days
  );
  return { accessToken, refreshToken, expiresIn: 15 * 60 };
};

// ─── Simulate network delay ───────────────────────────────────────────────────

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Returns user + access/refresh tokens on success.
 */
export const loginApi = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  await delay(800); // simulate network latency

  const { email, password } = credentials;

  const user = MOCK_USERS[email];
  const correctPassword = MOCK_PASSWORDS[email];

  if (!user || correctPassword !== password) {
    throw new Error("Invalid email or password");
  }

  const tokens = generateTokens(user);

  return { user, tokens };
};

/**
 * POST /auth/refresh
 * Accepts the current refreshToken and returns a new accessToken.
 */
export const refreshTokenApi = async (
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  await delay(400);

  if (!refreshToken || revokedTokens.has(refreshToken)) {
    throw new Error("Refresh token is invalid or expired");
  }

  // Decode mock payload to get user id
  try {
    const parts = refreshToken.split(".");
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded));

    // Check expiry
    if (Date.now() / 1000 > payload.exp) {
      throw new Error("Refresh token expired");
    }

    // Find user by sub
    const user = Object.values(MOCK_USERS).find((u) => u.id === payload.sub);
    if (!user) throw new Error("User not found");

    const newAccessToken = createMockJWT(
      { sub: user.id, email: user.email, name: user.name, role: user.role },
      15 * 60,
    );

    return { accessToken: newAccessToken, expiresIn: 15 * 60 };
  } catch {
    throw new Error("Failed to refresh token");
  }
};

/**
 * POST /auth/logout
 * Revokes the refreshToken server-side.
 */
export const logoutApi = async (refreshToken: string): Promise<void> => {
  await delay(300);
  revokedTokens.add(refreshToken);
};

/**
 * GET /auth/me
 * Returns the current user from the access token.
 */
export const getMeApi = async (accessToken: string): Promise<User> => {
  await delay(300);

  try {
    const parts = accessToken.split(".");
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(atob(padded));

    if (Date.now() / 1000 > payload.exp) {
      throw new Error("Access token expired");
    }

    const user = Object.values(MOCK_USERS).find((u) => u.id === payload.sub);
    if (!user) throw new Error("User not found");

    return user;
  } catch {
    throw new Error("Invalid access token");
  }
};
