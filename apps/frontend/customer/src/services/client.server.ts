import { type ApiFetcherArgs, initClient, tsRestFetchApi } from "@ts-rest/core";
import { customerContract } from "api/customer";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { backend } from "@/configs/default";
import { decryptSession, sessionName } from "@/utils/create_session";

export const client = initClient(
  { ...customerContract },
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
  const handlers: ((args: CustomResponseHandlerArgs) => Promise<void>)[] = [];
  for (const handler of handlers) {
    await handler(args);
  }
};
