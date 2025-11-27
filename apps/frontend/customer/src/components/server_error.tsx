"server-only";

import { isCustomError } from "customer_api";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

// import { ForceLogout } from "./force_logout";

type Props = {
  message: string;
};
export const ServerError: React.FC<Props> = ({ message }) => {
  return <div className="text-red-500">{message}</div>;
};

export const serverErrorMap = async <
  T extends {
    status: number;
    body: unknown;
    headers: Headers;
  },
>(
  response: T,
) => {
  // TODO: filter by pathname?
  //
  const headerStore = await headers();
  const pathname = headerStore.get("x-middleware-request-x-pathname");
  if (response.status === 401) {
    // TODO: force logout
    // return <ForceLogout />;
  }
  if (response.status === 404) {
    notFound();
  }

  if (response.status === 406) {
    redirect(`/suspended`);
  }

  if (response.status === 418) {
    // redirect(`/create_profile?redirectTo=${pathname}`);
    redirect(`/create_profile`);
  }

  if (isCustomError(response.body) && response.body.message) {
    return <ServerError message={response.body.message} />;
  }

  return <ServerError message={"Unknown error"} />;
};
