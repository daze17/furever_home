import { PetModel } from "@/models";
import { z } from "zod";

// export const CreatePetRequestBody = z.object({
//   name: z.string(),
//   birth_date: z.string().optional(),
//   species: z.enum(["dog", "cat", "bird", "fish", "other"]),
//   notes: z.string().optional(),
//   pet_image_url: z.string().optional(),
//   size: z.enum(["small", "medium", "large"]).optional(),
//   pet_status: z.enum(["adopting", "has_owner", "inactive"]),
//   customer_id: z.string().uuid(),
//   pet_extra_information_id: z.string().uuid().optional(),
// });
// export type CreatePetRequestBody = z.infer<typeof CreatePetRequestBody>;
//
export const CreatePetRequestBody = PetModel.pick({
  name: true,
  birth_date: true,
  species: true,
  notes: true,
  pet_image_url: true,
  size: true,
  pet_status: true,
  pet_extra_information_id: true,
});
export type CreatePetRequestBody = z.infer<typeof CreatePetRequestBody>;

// export const ListPetsResponseBody = z.object({
//   pets: z.array(PetResponseBody),
//   total: z.number(),
// });

// export type ListPetsResponseBody = z.infer<typeof ListPetsResponseBody>;

// export const ListPetsResponseBody = z.object({
//   pets: z.array(PetResponseBody),
//   total: z.number(),
// });

// export type ListPetsResponseBody = z.infer<typeof ListPetsResponseBody>;

// export const UpdatePetRequestBody = z
//   .object({
//     name: z.string(),
//     birth_date: z.string(),
//     species: z.enum(["dog", "cat", "bird", "fish", "other"]),
//     notes: z.string(),
//     pet_image_url: z.string(),
//     size: z.enum(["small", "medium", "large"]),
//     pet_status: z.enum(["adopting", "has_owner", "inactive"]),
//     pet_extra_information_id: z.string().uuid(),
//   })
//   .partial();

// export type UpdatePetRequestBody = z.infer<typeof UpdatePetRequestBody>;
