import { cache } from "react";

import { cookies } from "next/headers";
import "server-only";

import { session } from "@/configs/default";
import { client } from "@/services/client";

import { verifyAccessToken } from "./verify_access_token";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // TODO: Add refresh token here
  if (!token) {
    return null;
  }

  try {
    const { payload } = await verifyAccessToken(token, session.secret);

    const { sub } = payload;

    if (!sub) {
      return null;
    }

    const profile = await client.customer.getCustomerProfile();

    if (profile.status !== 200) {
      return null;
    }

    const { id: profileId, nickname } = profile.body;

    return {
      nickname,
      profileId,
    };
  } catch (err) {
    console.log(err, "err");
    return null;
  }
});
