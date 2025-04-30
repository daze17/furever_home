import { RegisterGoogleRequestBody } from "customer_api";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { client } from "@/services/client.server";
import { defaultOptions, sessionName } from "@/utils/create_session";

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
    const token = response.body.token;
    cookies().set(sessionName, token, defaultOptions);

    return new Response(null, {
      // FIXME: 307 throws INVALID_URL
      status: 302,
      headers: {
        Location: "/register?error=Unauthorized",
      },
    });
  } catch (error) {
    return new Response("Unauthorized", {
      status: 500,
    });
  }
};
