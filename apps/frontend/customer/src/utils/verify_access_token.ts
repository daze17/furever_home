import type { SessionPayload } from "../schemas/session";
import { verifyJWT } from "./verify_jwt";

export const verifyAccessToken = async (token: string, secret?: string) => {
  return await verifyJWT<SessionPayload>(token, secret);
};
