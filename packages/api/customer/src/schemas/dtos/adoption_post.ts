import { z } from "zod";

import {
  AdoptionPostModel,
  PetExtraInformationModel,
  PetModel,
} from "@/models";
import { paginationQuery } from "@/models/pagination";
import { PetSizeEnum, PetSpeciesEnum } from "common_api";

export const AdoptionPostResponseBody = AdoptionPostModel.extend({
  pet: PetModel.extend({
    pet_extra_information: PetExtraInformationModel.nullable(),
  }),
  is_favorite: z.boolean().default(false),
});
export type AdoptionPostResponseBody = z.infer<typeof AdoptionPostResponseBody>;

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
