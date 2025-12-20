import { RegisterGoogleRequestBody } from "customer_api";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { client } from "@/services/client.server";
import {
  accessTokenName,
  createAccessTokenCookie,
  createRefreshTokenCookie,
  refreshTokenName,
} from "@/utils/server";

export const runtime = "edge";
export const POST = async (request: NextRequest) => {
  try {
    const data = await request.formData();
    const credential = data.get("credential");

    if (typeof credential !== "string") {
      // TODO: login failed error
      return new Response(null, {
        status: 500,
      });
    }

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
    );
    if (!googleResponse.ok) {
      return new Response("Invalid", {
        status: 302,
        headers: {
          Location: "/register?error=invalid",
        },
      });
    }

    const parsedData = RegisterGoogleRequestBody.safeParse(
      await googleResponse.json(),
    );
    if (!parsedData.success) {
      return new Response("VALIDATION_ERROR", {
        status: 400,
      });
    }

    const response = await client.auth.registerGoogle({
      body: parsedData.data,
    });

    if (response.status !== 201) {
      // TODO: not registered error
      return new Response("Invalid", {
        status: 302,
        headers: {
          Location: "/register?error=invalid",
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
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    cookiesInstance.set(refreshTokenName, refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/api/session",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return new Response(null, {
      // FIXME: 307 throws INVALID_URL
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (error) {
    return new Response("Unauthorized", {
      status: 500,
    });
  }
};
