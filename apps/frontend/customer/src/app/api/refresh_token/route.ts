import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { decryptRefreshToken } from "@/utils/create_session";

export const GET = async () => {
  // Check if the request is authorized
  const headerStore = await headers();
  // const apiGuardTokenFromHeader = headerStore.get(API_GUARD_NAME)

  // if (!apiGuardTokenFromHeader) {
  //   return new NextResponse('Forbidden', { status: 403 })
  // }

  // // If the keys do not match or any error occurs, return Unauthorized
  // if (serverEnv.apiGuard.token !== apiGuardTokenFromHeader) {
  //   return new NextResponse('Forbidden', { status: 403 })
  // }

  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get("refreshToken")?.value;

  if (!refreshTokenCookie) {
    return NextResponse.json({ refreshToken: null });
  }

  // If the keys match return refresh token
  const { refreshToken } = await decryptRefreshToken(refreshTokenCookie);

  return NextResponse.json({ refreshToken });
};
