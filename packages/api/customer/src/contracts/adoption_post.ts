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
    path: "/adoption_posts",
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
    path: "/adoption_posts/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      200: AdoptionPostResponseBody,
      404: CustomError,
    },
    summary: "Get an adoption post by ID",
  },
  addFavoriteAdoptionPost: {
    method: "POST",
    path: "/favorite_adoption_posts/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    body: z.object({}),
    responses: {
      201: z.object({}),
      404: CustomError,
    },
    summary: "Add pet to favorite adoption post list",
  },
  // Get a list of favorite pets
  getFavoriteAdoptionPostsList: {
    method: "GET",
    path: "/favorite_adoption_posts",
    query: AdoptionPostsQuery,
    responses: {
      200: z.object({
        data: AdoptionPostsListResponseBody,
        meta: PaginationMeta,
      }),
      400: CustomError,
    },
    summary: "Get a list of favorite adoption posts",
  },
  //"Remove a pet from favorite pets list by ID",
  removeFavoriteAdoptionPost: {
    method: "DELETE",
    path: "/favorite_adoption_posts/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      204: z.object({}),
      404: CustomError,
    },
    summary: "Remove a adoption post from favorite adoption post list by ID",
  },
});
