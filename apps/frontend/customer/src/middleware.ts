// import { UserModel, UserRoleEnum } from "api/customer";
import type { NextMiddleware, NextRequest } from "next/server";

import { allowedRoutes, authRoutes, publicRoutes } from "@/configs/default";
import { getSession } from "@/utils/get_session";

export const config = {
  matcher: ["/((?!api|_next|assets|favicon.ico).*)"],
};

type Session = {
  id: string;
  // role: UserRoleEnum;
};
export const middleware: NextMiddleware = async (request) => {
  const payload = await getSession();
  const session: Session | null = payload
    ? {
        id: payload.sub,
        // role: payload.role,
      }
    : null;

  const guards = [authRoutesGuard, protectedRoutesGuard];
  for (const guard of guards) {
    const response = guard(request, session);
    if (typeof response !== "undefined") {
      return response;
    }
  }
};

const authRoutesGuard = (request: NextRequest, session: Session | null) => {
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => {
    if (typeof route === "string") {
      return route === pathname;
    }
    return route.test(pathname);
  });
  if (!isAuthRoute) {
    return;
  }

  if (session) {
    return Response.redirect(new URL("/", request.nextUrl), 307);
  }
};

const protectedRoutesGuard = (
  request: NextRequest,
  session: Session | null,
) => {
  const { origin, pathname } = request.nextUrl;

  const isProtectedRoute = ![...authRoutes, ...publicRoutes].some((route) => {
    if (typeof route === "string") {
      return route === pathname;
    }
    return route.test(pathname);
  });

  if (!isProtectedRoute) {
    return;
  }
  if (!session) {
    return Response.redirect(new URL("/login", request.nextUrl), 307);
  }

  // const isAllowedRoute = allowedRoutes.some((route) => {
  //   if (typeof route === "string") {
  //     return route === pathname;
  //   }
  //   return route.test(pathname);
  // });
  // if (!isAllowedRoute) {
  //   const requestHeaders = new Headers(request.headers);
  //   requestHeaders.set(
  //     "x-data",
  //     JSON.stringify({
  //       message: "Unauthorized",
  //       redirect: "/",
  //     }),
  //   );
  //
  //   return NextResponse.rewrite(new URL("/", origin), {
  //     request: {
  //       headers: requestHeaders,
  //     },
  //   });
  // }
};
