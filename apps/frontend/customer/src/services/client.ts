import { type ApiFetcherArgs, initClient, tsRestFetchApi } from "@ts-rest/core";
import { customerContract } from "customer_api";

import { backend } from "@/configs/default";
import { Session } from "@/schemas/session";
import { sessionName } from "@/utils";
import { checkIfTokenIsValid } from "@/utils/check_if_token_is_valid";

export const client = initClient(
  {
    ...customerContract,
    // ...commonContract,
  },
  {
    api: async (args) => {
      const interceptedArgs = await requestInterceptor(args);
      const response = await tsRestFetchApi(interceptedArgs);
      const interceptedResponse = await responseInterceptor(response);

      const handledResponse = await unauthorizedResponseHandler(
        args,
        interceptedResponse,
      );

      if (handledResponse) {
        return handledResponse;
      }

      return interceptedResponse;
    },
    baseUrl: backend.url,
    baseHeaders: {
      // 'x-devalue': 'false',
    },
  },
);
type CustomRequestHandlerArgs = ApiFetcherArgs;

const getSession = async () => {
  // Check if we're on the server or client
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (globalThis.window === undefined) {
    // When server accesses - directly read from cookies
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      return accessToken;
    }

    return null;
  } else {
    // When client accesses - fetch from API route
    try {
      const sessionResponse = await fetch(`/api/session`);

      if (!sessionResponse.ok) {
        // unauthenticated
        return null;
      }

      const session: Session | null = await sessionResponse.json();

      return session;
    } catch {
      // network/configuration error occurred
      return null;
    }
  }
};

const requestInterceptor = async (_args: CustomRequestHandlerArgs) => {
  const session = await getSession();

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

const responseInterceptor = async (
  response: Awaited<ReturnType<typeof tsRestFetchApi>>,
) => {
  // NOTE: devalue added DEVALUE_STRING_ prefix
  const body = response.body;

  // if (typeof body === 'string' && body.startsWith(devaluePrefix)) {
  //   const devalue = await import('devalue')
  //   const devalueString = body.replace(new RegExp(`^${devaluePrefix}`), '')

  //   return {
  //     ...response,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //     body: devalue.parse(devalueString),
  //   }
  // }

  // FIXME: renmove after devalue added DEVALUE_STRING_ prefix
  // const devalueHeader = response.headers.get('x-devalue')

  // if (devalueHeader === 'true') {
  //   const devalue = await import('devalue')

  //   return {
  //     ...response,
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //     body: devalue.parse(response.body as string),
  //   }
  // }

  return response;
};

const unauthorizedResponseHandler = async (
  request: ApiFetcherArgs,
  response: Awaited<ReturnType<typeof tsRestFetchApi>>,
) => {
  if (response.status !== 401) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const isServer = globalThis.window === undefined;

  // Don't handle if it is refresh token request 401
  // because it will create infinite loop
  if (request.path.endsWith("/auth/refresh")) {
    return;
  }

  let refreshToken: null | string = null;

  if (isServer) {
    const nextHeaders = await import("next/headers");
    const cookieStore = await nextHeaders.cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken")?.value;
    const { decryptRefreshToken } = await import("@/utils/create_session");

    if (refreshTokenCookie) {
      const decryptedToken = await decryptRefreshToken(refreshTokenCookie);

      refreshToken = decryptedToken.refreshToken;
    } else {
      refreshToken = null;
    }
  } else {
    // const { clientEnv } = await import('@/configs/env/env.client')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshTokenResponse: { refreshToken: null | string } = await fetch(
      "/api/refresh_token",
      {
        headers: {
          // TODO: check
          // [API_GUARD_NAME]: clientEnv.apiGuard.token,
        },
      },
    ).then((res) => res.json());

    refreshToken = refreshTokenResponse.refreshToken;
  }

  //  Cant refresh token if it is expired or not found
  if (!refreshToken || !checkIfTokenIsValid(refreshToken)) {
    if (!isServer) {
      globalThis.location.reload();
    }

    return;
  }

  const { body, status } = await client.auth.refreshToken({
    body: {
      refreshToken,
    },
  });

  if (status !== 201) {
    if (!isServer) {
      globalThis.location.reload();
    }

    return;
  }

  const accessToken = body.accessToken;

  const retryRequest = request;

  retryRequest.headers.Authorization = `Bearer ${accessToken}`;
  // Get locale if available
  // const locale = await getLocale()

  // retryRequest.headers['X-Locale'] = locale

  return await tsRestFetchApi(retryRequest);
};
