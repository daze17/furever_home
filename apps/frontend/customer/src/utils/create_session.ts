//
import type { CookieSerializeOptions } from "cookie";
import { serialize } from "cookie";

//
import { session } from "@/configs/default";
import { Session } from "@/schemas/session";

//
import { decrypt, encrypt } from "./crypto_cookie";

export const defaultOptions: CookieSerializeOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
  sameSite: "lax",
  secure: true,
};
export const sessionName = "accessToken";

export const createSession = (
  token: string,
  options?: Partial<CookieSerializeOptions>,
) => {
  return serialize(sessionName, token, { ...defaultOptions, ...options });
};

export const encryptSession = (value: string = "") => {
  return encrypt(value, session.secret);
};
export const decryptSession = (value: string = ""): Session | null => {
  const decryptedCookie = decrypt(value, session.secret);
  const parsed = Session.safeParse(tryParseJson(decryptedCookie));

  if (!parsed.success) {
    return null;
  }

  return parsed.data;
};

export const tryParseJson = <T = unknown>(json: any): T | undefined => {
  try {
    const parsed = JSON.parse(json) as T;
    return parsed;
  } catch (error) {
    return;
  }
};
