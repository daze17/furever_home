import type { NextMiddleware, NextRequest } from "next/server";

import { allowedRoutes, authRoutes, publicRoutes } from "@/configs/default";
import { getSession } from "@/utils/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions: .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

type Session = {
  id: string;
  // role: UserRoleEnum;
};
export const proxy: NextMiddleware = async (request) => {
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
    // Redirect authenticated users to callback URL or home
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/";
    return Response.redirect(new URL(callbackUrl, request.nextUrl), 307);
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
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl, 307);
  }

  const isAllowedRoute = allowedRoutes.some((route) => {
    if (typeof route === "string") {
      return route === pathname;
    }
    return route.test(pathname);
  });
  if (!isAllowedRoute) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl, 307);
  }
};
