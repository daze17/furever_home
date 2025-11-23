import { PetExtraInformationModel, PetModel } from "@/models";
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

export const PetResponseBody = PetModel;
export type PetResponseBody = z.infer<typeof PetResponseBody>;

export const ListPetsResponseBody = z.object({
  pets: z.array(PetResponseBody),
  total: z.number(),
});
export type ListPetsResponseBody = z.infer<typeof ListPetsResponseBody>;

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
