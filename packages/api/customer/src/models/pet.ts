import { favorites, pet_extra_informations, pets } from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const PetModel = createSelectSchema(pets);
export type PetModel = z.infer<typeof PetModel>;

export const PetExtraInformationModel = createSelectSchema(
  pet_extra_informations,
);
export type PetExtraInformationModel = z.infer<typeof PetExtraInformationModel>;

export const FavoriteModel = createSelectSchema(favorites);
export type FavoriteModel = z.infer<typeof FavoriteModel>;
