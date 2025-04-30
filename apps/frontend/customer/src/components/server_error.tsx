"server-only";

import { isCustomError } from "api/customer";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

// import { ForceLogout } from "./force_logout";

type Props = {
  message: string;
};
export const ServerError: React.FC<Props> = ({ message }) => {
  return <div className="text-red-500">{message}</div>;
};

export const serverErrorMap = <
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
  const pathname = headers().get("x-middleware-request-x-pathname");
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
