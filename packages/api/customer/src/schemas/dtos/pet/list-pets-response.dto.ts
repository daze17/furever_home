import { z } from "zod";

import { PetResponseBody } from "./pet-response.dto";

export const ListPetsResponseBody = z.object({
  pets: z.array(PetResponseBody),
  total: z.number(),
});

export type ListPetsResponseBody = z.infer<typeof ListPetsResponseBody>;
