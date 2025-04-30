import type { JWTPayload } from "jose";
import { jwtVerify } from "jose";

export const verifyJWT = async <T = {}>(token: string, secret?: string) => {
  const encodedSecret = new TextEncoder().encode(secret);
  return await jwtVerify<JWTPayload & T>(token, encodedSecret);
};
