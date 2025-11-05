import { z } from "zod";

import { PetModel } from "@/models";

export const PetResponseBody = PetModel;
export type PetResponseBody = z.infer<typeof PetResponseBody>;
