import type { TokenPayload } from "google-auth-library";
import { cookies } from "next/headers";
import { type NextRequest } from "next/server";

import { client } from "@/services/client.server";
import { defaultOptions, sessionName } from "@/utils/create_session";

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
    const token = response.body.token;

    cookies().set(sessionName, token, defaultOptions);

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
