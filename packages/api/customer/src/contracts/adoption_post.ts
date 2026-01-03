import { z } from "zod";

import { c } from "@/contract";
import { CustomError } from "@/models/custom_error";
import { PaginationMeta } from "@/models/pagination";
import {
  AdoptionPostResponseBody,
  AdoptionPostsListResponseBody,
  AdoptionPostsQuery,
} from "@/schemas/dtos";

export const adoptionPostContract = c.router({
  getAdoptionPostsList: {
    method: "GET",
    path: "/adoption-posts",
    query: AdoptionPostsQuery,
    responses: {
      200: z.object({
        data: AdoptionPostsListResponseBody,
        meta: PaginationMeta,
      }),
      400: CustomError,
    },
    summary: "List all adoption posts with optional filters",
  },

  getAdoptionPost: {
    method: "GET",
    path: "/adoption-posts/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      200: AdoptionPostResponseBody,
      404: CustomError,
    },
    summary: "Get an adoption post by ID",
  },
});
