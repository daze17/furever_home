import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { initClient, tsRestFetchApi } from "@ts-rest/core";
import { customerContract } from "customer_api";

import { backend } from "@/configs/default";
import {
  createAccessTokenCookie,
  createRefreshTokenCookie,
  refreshTokenName,
} from "@/utils/server";

// PUT - Refresh access token using refresh token
export const PUT = async () => {
  try {
    const refreshToken = (await cookies()).get(refreshTokenName)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 },
      );
    }

    // Call backend refresh endpoint
    const client = initClient(customerContract, {
      baseUrl: backend.url,
      api: tsRestFetchApi,
    });

    const response = await client.auth.refreshToken({
      body: { refreshToken },
    });

    if (response.status === 201) {
      const { accessToken, refreshToken: newRefreshToken } = response.body;

      // Set new tokens in cookies
      const headers = new Headers();
      headers.append("Set-Cookie", createAccessTokenCookie(accessToken));
      headers.append("Set-Cookie", createRefreshTokenCookie(newRefreshToken));

      return new NextResponse(
        JSON.stringify({ accessToken }),
        {
          status: 200,
          headers,
        },
      );
    }

    // Refresh failed
    return NextResponse.json(
      { error: "Token refresh failed" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Token refresh error" },
      { status: 500 },
    );
  }
};
