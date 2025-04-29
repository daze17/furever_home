import { pets } from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const PetModel = createSelectSchema(pets);
export type PetModel = z.infer<typeof PetModel>;
