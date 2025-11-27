import type { TokenPayload } from "google-auth-library";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

import { client } from "@/services/client.server";
import {
  accessTokenName,
  createAccessTokenCookie,
  createRefreshTokenCookie,
  refreshTokenName,
} from "@/utils/create_tokens";

export const runtime = "edge";
export const POST = async (request: NextRequest) => {
  try {
    const data = await request.formData();
    const credential = data.get("credential");

    if (typeof credential !== "string") {
      return new Response(null, {
        status: 500,
        headers: {
          Location: "/login",
        },
      });
    }

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
    );
    if (!googleResponse.ok) {
      return new Response(null, {
        status: 500,
        headers: {
          Location: "/login",
        },
      });
    }

    const { sub }: TokenPayload = await googleResponse.json();
    const response = await client.auth.loginGoogle({ body: { sub } });

    if (response?.status !== 201) {
      return new Response("Unauthorized", {
        status: 302,
        headers: {
          Location: "/login?error=Unauthorized",
        },
      });
    }
    const { accessToken, refreshToken } = response.body;

    // Set both tokens as cookies
    const cookiesInstance = await cookies();
    cookiesInstance.set(accessTokenName, accessToken, {
      httpOnly: true,
      maxAge: 60 * 15, // 15 minutes
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    cookiesInstance.set(refreshTokenName, refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/api/session",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirectTo");

    return new Response(null, {
      // FIXME: 307 throws INVALID_URL
      status: 302,
      headers: {
        Location: redirectTo || "/",
      },
    });
  } catch (error) {
    return new Response("Unauthorized", {
      status: 500,
    });
  }
};
