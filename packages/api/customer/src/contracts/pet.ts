import { z } from "zod";

import { c } from "@/contract";
import { CustomError } from "@/models/custom_error";
import {
  CreatePetRequestBody,
  PetResponseBody,
  PetsListResponseBody,
  PetsQuery,
  UpdatePetRequestBody,
} from "@/schemas/dtos";
import { PaginationMeta } from "@/models/pagination";

export const petContract = c.router({
  // Create a new pet
  createPet: {
    method: "POST",
    path: "/pets",
    body: CreatePetRequestBody,
    responses: {
      201: z.object({}),
      400: CustomError,
    },
    summary: "Create a new pet",
  },

  // Get all adoptable pets (with optional filters)
  getAdoptablePetsList: {
    method: "GET",
    path: "/pets",
    query: PetsQuery,
    responses: {
      200: z.object({
        data: PetsListResponseBody,
        meta: PaginationMeta,
      }),
      400: CustomError,
    },
    summary: "List all adoptable pets with optional filters",
  },

  // Get a single adoptable pet by ID
  getAdoptablePet: {
    method: "GET",
    path: "/pets/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      200: PetResponseBody,
      404: CustomError,
    },
    summary: "Get an adoptable pet by ID",
  },

  // Update a pet
  updatePet: {
    method: "PATCH",
    path: "/pets/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    body: UpdatePetRequestBody,
    responses: {
      200: PetResponseBody,
      400: CustomError,
      404: CustomError,
    },
    summary: "Update a pet by ID",
  },

  // Delete a pet
  deletePet: {
    method: "DELETE",
    path: "/pets/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    body: z.object({}),
    responses: {
      204: z.object({}),
      404: CustomError,
    },
    summary: "Delete a pet by ID",
  },
});
