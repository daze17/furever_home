import { z } from "zod";

export const CreatePetRequestBody = z.object({
  name: z.string(),
  birth_date: z.string().optional(),
  species: z.enum(["dog", "cat", "bird", "fish", "other"]),
  notes: z.string().optional(),
  pet_image_url: z.string().optional(),
  size: z.enum(["small", "medium", "large"]).optional(),
  pet_status: z.enum(["adopting", "has_owner", "inactive"]),
  customer_id: z.string().uuid(),
  pet_extra_information_id: z.string().uuid().optional(),
});

export type CreatePetRequestBody = z.infer<typeof CreatePetRequestBody>;
