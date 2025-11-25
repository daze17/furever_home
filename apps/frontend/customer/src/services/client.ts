import { type ApiFetcherArgs, initClient, tsRestFetchApi } from "@ts-rest/core";
import { customerContract } from "customer_api";
import { cookies } from "next/headers";

import { backend } from "@/configs/default";
import { Session } from "@/schemas/session";
import { sessionName } from "@/utils/create_session";

export const client = initClient(
  {
    ...customerContract,
    // ...commonContract,
  },
  {
    baseHeaders: {},
    baseUrl: backend.url,
    api: async (args) => {
      const interceptedArgs = await requestInterceptor(args);
      let response = await tsRestFetchApi(interceptedArgs);
      const newResponse = await responseInterceptor({
        ...interceptedArgs,
        response,
      });

      // If interceptor returned a new response (from retry), use it
      return newResponse || response;
    },
  },
);
type CustomRequestHandlerArgs = ApiFetcherArgs;
const requestInterceptor = async (_args: CustomRequestHandlerArgs) => {
  // const session = cookies().get(sessionName)?.value;
  const _session = await fetch(`/api/session`);
  const session: Session | null = await _session.json();

  const args = _args;

  if (session) {
    args.headers["Authorization"] = `Bearer ${session}`;
  }

  return args;
};

type Response = Awaited<ReturnType<typeof tsRestFetchApi>>;
type CustomResponseHandlerArgs = CustomRequestHandlerArgs & {
  response: Response;
};

// Track if refresh is in progress to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const responseInterceptor = async (args: CustomResponseHandlerArgs) => {
  const handlers: ((
    args: CustomResponseHandlerArgs,
  ) => Promise<Response | void>)[] = [_handle401, _forceLogout];
  for (const handler of handlers) {
    const response = await handler(args);
    if (response) {
      // Handler returned a new response, use it
      return response;
    }
  }
};

// Handle 401 errors with token refresh
const _handle401 = async ({
  path,
  response,
  ...requestArgs
}: CustomResponseHandlerArgs): Promise<Response | void> => {
  // Skip 401 handling for authentication endpoints (they're expected to return 401)
  const authEndpoints = [
    "/login/credentials",
    "/login/google",
    "/register",
    "/reset-password",
    "/refresh",
  ];
  const isAuthEndpoint = authEndpoints.some((endpoint) =>
    path.includes(endpoint),
  );

  if (response.status !== 401 || isAuthEndpoint) {
    return;
  }

  // If already refreshing, wait for it to complete
  if (isRefreshing && refreshPromise) {
    const success = await refreshPromise;
    if (success) {
      // Retry the original request with new token
      const newSession = await fetch(`/api/session`);
      const session = await newSession.json();

      if (session) {
        requestArgs.headers["Authorization"] = `Bearer ${session}`;
        return await tsRestFetchApi(requestArgs as ApiFetcherArgs);
      }
    }
    return;
  }

  // Start refresh process
  isRefreshing = true;
  refreshPromise = attemptTokenRefresh();

  const success = await refreshPromise;
  isRefreshing = false;
  refreshPromise = null;

  if (success) {
    // Retry the original request with new token
    const newSession = await fetch(`/api/session`);
    const session = await newSession.json();

    if (session) {
      requestArgs.headers["Authorization"] = `Bearer ${session}`;
      return await tsRestFetchApi(requestArgs as ApiFetcherArgs);
    }
  } else {
    // Refresh failed, force logout
    await fetch("/api/session", { method: "DELETE" });
    window.location.href = "/login?session_expired=true";
  }
};

// Attempt to refresh the token
const attemptTokenRefresh = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/session/refresh", {
      method: "PUT",
    });

    return response.ok;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};


// const _login = async ({ path, response }: CustomResponseHandlerArgs) => {
//   if (!path.endsWith("/login/google") || response.status !== 200) {
//     return;
//   }

//   await fetch("/api/session", {
//     method: "POST",
//     body: JSON.stringify(response.body),
//   });
// };

const _forceLogout = async ({ path, response }: CustomResponseHandlerArgs) => {
  if (!path.endsWith("change_password") || response.status !== 200) {
    return;
  }
  await fetch("/api/session", {
    method: "DELETE",
  });
};
