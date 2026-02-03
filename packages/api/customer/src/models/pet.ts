import {
  favorites,
  pet_extra_informations,
  pet_images,
  pet_medical_records,
  pets,
  vaccinations,
} from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const PetModel = createSelectSchema(pets);
export type PetModel = z.infer<typeof PetModel>;

export const PetExtraInformationModel = createSelectSchema(
  pet_extra_informations,
);
export type PetExtraInformationModel = z.infer<typeof PetExtraInformationModel>;

export const PetMedicalRecordModel = createSelectSchema(pet_medical_records);
export type PetMedicalRecordModel = z.infer<typeof PetMedicalRecordModel>;

export const VaccinationModel = createSelectSchema(vaccinations);
export type VaccinationModel = z.infer<typeof VaccinationModel>;

export const FavoriteModel = createSelectSchema(favorites);
export type FavoriteModel = z.infer<typeof FavoriteModel>;

export const PetImageModel = createSelectSchema(pet_images);
export type PetImageModel = z.infer<typeof PetImageModel>;
