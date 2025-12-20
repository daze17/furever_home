import type { CookieSerializeOptions } from "cookie";
import { serialize } from "cookie";

import { accessTokenName, refreshTokenName } from "./constants";

const baseOptions: CookieSerializeOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

// Access token: short-lived (15 minutes)
export const accessTokenOptions: CookieSerializeOptions = {
  ...baseOptions,
  maxAge: 60 * 15, // 15 minutes
};

// Refresh token: long-lived (7 days), restricted path for security
export const refreshTokenOptions: CookieSerializeOptions = {
  ...baseOptions,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/api/session", // Restricted to session API routes only
};

export const createAccessTokenCookie = (
  token: string,
  options?: Partial<CookieSerializeOptions>,
) => {
  return serialize(accessTokenName, token, {
    ...accessTokenOptions,
    ...options,
  });
};

export const createRefreshTokenCookie = (
  token: string,
  options?: Partial<CookieSerializeOptions>,
) => {
  return serialize(refreshTokenName, token, {
    ...refreshTokenOptions,
    ...options,
  });
};
