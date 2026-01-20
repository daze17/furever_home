import { z } from "zod";

import {
  AdoptionPostModel,
  PetExtraInformationModel,
  PetImageModel,
  PetModel,
} from "@/models";
import { paginationQuery } from "@/models/pagination";
import { PetSizeEnum, PetSpeciesEnum, StatusEnum } from "common_api";

export const AdoptionPostResponseBody = AdoptionPostModel.extend({
  pet: PetModel.extend({
    pet_extra_information: PetExtraInformationModel.nullable(),
    images: PetImageModel.array(),
  }),
  is_favorite: z.boolean().default(false),
});
export type AdoptionPostResponseBody = z.infer<typeof AdoptionPostResponseBody>;

// Own adoption post response (without is_favorite)
export const OwnAdoptionPostResponseBody = AdoptionPostModel.extend({
  pet: PetModel.extend({
    pet_extra_information: PetExtraInformationModel.nullable(),
    images: PetImageModel.array(),
  }),
});
export type OwnAdoptionPostResponseBody = z.infer<
  typeof OwnAdoptionPostResponseBody
>;

export const OwnAdoptionPostsListResponseBody =
  OwnAdoptionPostResponseBody.array();
export type OwnAdoptionPostsListResponseBody = z.infer<
  typeof OwnAdoptionPostsListResponseBody
>;

// Create adoption post request body
export const CreateAdoptionPostRequestBody = z.object({
  pet_id: z.number(),
  price: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});
export type CreateAdoptionPostRequestBody = z.infer<
  typeof CreateAdoptionPostRequestBody
>;

// Update adoption post request body
export const UpdateAdoptionPostRequestBody = z.object({
  price: z.number().nullable().optional(),
  address: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  post_status: StatusEnum.optional(),
});
export type UpdateAdoptionPostRequestBody = z.infer<
  typeof UpdateAdoptionPostRequestBody
>;

// Query for own adoption posts
export const OwnAdoptionPostsQuery = z
  .object({
    post_status: StatusEnum.array(),
  })
  .merge(paginationQuery(z.enum(["created_at", "price"])))
  .partial()
  .optional();
export type OwnAdoptionPostsQuery = z.infer<typeof OwnAdoptionPostsQuery>;

export const AdoptionPostsListResponseBody = AdoptionPostResponseBody.array();
export type AdoptionPostsListResponseBody = z.infer<
  typeof AdoptionPostsListResponseBody
>;

export const AdoptionPostsQuery = z
  .object({
    // Pet filters
    name: PetModel.shape.name,
    sizes: PetSizeEnum.array(),
    species: PetSpeciesEnum.array(),

    // Behavioral filters (from pet_extra_information)
    energy_levels: PetExtraInformationModel.shape.energy_level.array(),
    friendliness_with_children_levels:
      PetExtraInformationModel.shape.friendliness_with_children.array(),
    friendliness_with_pets_levels:
      PetExtraInformationModel.shape.friendliness_with_pets.array(),
    is_house_trained: z.boolean(),
    training_levels: PetExtraInformationModel.shape.training_level.array(),

    // Age range filter
    birth_date_from: z.string().date(),
    birth_date_to: z.string().date(),

    // Adoption post specific filters
    price_min: z.coerce.number(),
    price_max: z.coerce.number(),
  })
  .merge(paginationQuery(z.enum(["name", "created_at", "price"])))
  .partial()
  .optional();
export type AdoptionPostsQuery = z.infer<typeof AdoptionPostsQuery>;
