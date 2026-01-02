import { FavoriteModel, PetExtraInformationModel, PetModel } from "@/models";
import { paginationQuery } from "@/models/pagination";
import { PetSizeEnum, PetSpeciesEnum } from "common_api";
import { z } from "zod";

export const CreatePetExtraInformationRequestBody =
  PetExtraInformationModel.pick({
    energy_level: true,
    friendliness_with_children: true,
    friendliness_with_pets: true,
    is_house_trained: true,
    training_level: true,
    special_needs: true,
    dietary_restrictions: true,
  });
export type CreatePetExtraInformationRequestBody = z.infer<
  typeof CreatePetExtraInformationRequestBody
>;

export const CreatePetRequestBody = PetModel.pick({
  name: true,
  birth_date: true,
  species: true,
  notes: true,
  pet_image_url: true,
  size: true,
  pet_status: true,
}).extend({
  pet_extra_information: CreatePetExtraInformationRequestBody,
});
export type CreatePetRequestBody = z.infer<typeof CreatePetRequestBody>;

export const PetResponseBody = PetModel.extend({
  pet_extra_information: PetExtraInformationModel.nullable(),
  owner_phone: z.string().nullable().optional(),
});
export type PetResponseBody = z.infer<typeof PetResponseBody>;

export const PetsListResponseBody = PetResponseBody.array();
export type PetsListResponseBody = z.infer<typeof PetsListResponseBody>;

export const UpdatePetRequestBody = PetModel.pick({
  name: true,
  birth_date: true,
  species: true,
  notes: true,
  pet_image_url: true,
  size: true,
  pet_status: true,
  pet_extra_information_id: true,
}).partial();
export type UpdatePetRequestBody = z.infer<typeof UpdatePetRequestBody>;

export const PetsQuery = z
  .object({
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
  })
  .merge(paginationQuery(z.enum(["name", "created_at"])))
  .partial()
  .optional();
export type PetsQuery = z.infer<typeof PetsQuery>;

// export const AddFavoritePetRequestBody = FavoriteModel.pick({
//   pet_id: true,
// });
// export type AddFavoritePetRequestBody = z.infer<typeof AddFavoritePetRequestBody>;
