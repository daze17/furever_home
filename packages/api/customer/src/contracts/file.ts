import { z } from "zod";

import { c } from "@/contract";

export const fileContract = c.router({
  getFileByKey: {
    method: "GET",
    path: "/files",
    // Object key has slash in it, so we need to use query param instead of path param
    query: z.object({
      key: z.string(),
    }),
    responses: {
      200: z.object({}),
    },
    summary: "Get a file by key",
  },
});
