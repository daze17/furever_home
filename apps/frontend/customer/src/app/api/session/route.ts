//
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSession, sessionName } from "@/utils/create_session";

export const GET = () => {
  const session = cookies().get(sessionName)?.value;

  return NextResponse.json(session);
};

export const POST = async (request: Request) => {
  const data = await request.text();

  return new NextResponse("token", {
    status: 200,
    headers: {
      "Set-Cookie": createSession(data),
    },
  });
};

export const DELETE = () => {
  // https://nextjs.org/docs/app/building-your-application/caching#invalidation-1
  cookies().delete(sessionName);

  return new NextResponse(null, { status: 200 });
};
