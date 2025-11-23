import { z } from "zod";

import { c } from "@/contract";
import { CustomError } from "@/models/custom_error";
import {
  CreatePetRequestBody,
  ListPetsResponseBody,
  PetResponseBody,
  UpdatePetRequestBody,
} from "@/schemas/dtos";

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

  // Get all pets (with optional customer filter)
  listPets: {
    method: "GET",
    path: "/pets",
    query: z.object({
      customer_id: z.string().uuid().optional(),
      species: z.string().optional(),
      pet_status: z.string().optional(),
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
    }),
    responses: {
      200: ListPetsResponseBody,
      400: CustomError,
    },
    summary: "List all pets with optional filters",
  },

  // Get a single pet by ID
  getPet: {
    method: "GET",
    path: "/pets/:id",
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      200: PetResponseBody,
      404: CustomError,
    },
    summary: "Get a pet by ID",
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
