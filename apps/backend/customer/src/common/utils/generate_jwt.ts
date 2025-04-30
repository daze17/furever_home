import type { JWTPayload } from "jose";
import { SignJWT } from "jose";

export const generateJWT = async ({
  expirationTime,
  payload,
  secret,
}: {
  expirationTime: string | number | Date;
  payload?: JWTPayload;
  secret?: string;
}) => {
  const encodedSecret = new TextEncoder().encode(secret);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expirationTime)
    .sign(encodedSecret);

  return token;
};
