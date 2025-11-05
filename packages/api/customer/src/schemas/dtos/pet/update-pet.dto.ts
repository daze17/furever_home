import { z } from "zod";

export const UpdatePetRequestBody = z
  .object({
    name: z.string(),
    birth_date: z.string(),
    species: z.enum(["dog", "cat", "bird", "fish", "other"]),
    notes: z.string(),
    pet_image_url: z.string(),
    size: z.enum(["small", "medium", "large"]),
    pet_status: z.enum(["adopting", "has_owner", "inactive"]),
    pet_extra_information_id: z.string().uuid(),
  })
  .partial();

export type UpdatePetRequestBody = z.infer<typeof UpdatePetRequestBody>;
