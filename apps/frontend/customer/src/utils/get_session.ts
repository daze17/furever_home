import { cookies } from "next/headers";
import "server-only";

import { session } from "@/configs/default";

import { verifyAccessToken } from "./verify_access_token";

export const getSession = async () => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return null;
  }

  const { payload } = await verifyAccessToken(token, session.secret);

  return payload;
};
