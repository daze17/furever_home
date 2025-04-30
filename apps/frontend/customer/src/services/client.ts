import { type ApiFetcherArgs, initClient, tsRestFetchApi } from "@ts-rest/core";
import { customerContract } from "api/customer";
import { cookies } from "next/headers";

import { backend } from "@/configs/default";
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
      const response = await tsRestFetchApi(interceptedArgs);
      await responseInterceptor({ ...interceptedArgs, response });

      return response;
    },
  },
);
type CustomRequestHandlerArgs = ApiFetcherArgs;
const requestInterceptor = async (_args: CustomRequestHandlerArgs) => {
  const session = cookies().get(sessionName)?.value;
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
const responseInterceptor = async (args: CustomResponseHandlerArgs) => {
  const handlers: ((args: CustomResponseHandlerArgs) => Promise<void>)[] = [
    // _login,
    _forceLogout,
  ];
  for (const handler of handlers) {
    await handler(args);
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
