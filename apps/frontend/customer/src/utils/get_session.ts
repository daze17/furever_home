import "server-only";

import { cookies } from "next/headers";

import { session } from "@/configs/default";

import { verifyAccessToken } from "./verify_access_token";

export const getSession = async () => {
  const token = cookies().get("session")?.value;
  if (!token) {
    return null;
  }

  const { payload } = await verifyAccessToken(token, session.secret);

  return payload;
};
