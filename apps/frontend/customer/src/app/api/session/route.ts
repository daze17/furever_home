//
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  accessTokenName,
  createAccessTokenCookie,
  createRefreshTokenCookie,
  refreshTokenName,
} from "@/utils/server";

// GET - Returns access token only
export const GET = async () => {
  const accessToken = (await cookies()).get(accessTokenName)?.value;
  if (!accessToken) return NextResponse.json(null);

  return NextResponse.json(accessToken);
};

// POST - Stores both access and refresh tokens
export const POST = async (request: Request) => {
  const { accessToken, refreshToken } = await request.json();

  const headers = new Headers();
  headers.append("Set-Cookie", createAccessTokenCookie(accessToken));
  headers.append("Set-Cookie", createRefreshTokenCookie(refreshToken));

  return new NextResponse("tokens_set", {
    status: 200,
    headers,
  });
};

// DELETE - Clears both tokens
export const DELETE = async () => {
  // https://nextjs.org/docs/app/building-your-application/caching#invalidation-1
  (await cookies()).delete(accessTokenName);
  (await cookies()).delete(refreshTokenName);

  return new NextResponse(null, { status: 200 });
};
