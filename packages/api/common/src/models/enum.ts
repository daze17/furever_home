import { customer_accounts, pets, status } from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const CustomerStatusEnumSchema =
  createSelectSchema(customer_accounts).shape.status;
export type CustomerStatusEnum = z.infer<typeof CustomerStatusEnumSchema>;

// Export enum values for runtime usage
export const CustomerStatusEnum = {
  active: "active",
  inactive: "inactive",
  pending: "pending",
} as const;

export const PetSizeEnum = createSelectSchema(pets).shape.size;
export type PetSizeEnum = z.infer<typeof PetSizeEnum>;

export const PetSpeciesEnum = createSelectSchema(pets).shape.species;
export type PetSpeciesEnum = z.infer<typeof PetSpeciesEnum>;

export const PetStatusEnum = createSelectSchema(pets).shape.pet_status;
export type PetStatusEnum = z.infer<typeof PetStatusEnum>;

// Status enum for adoption_posts post_status
export const StatusEnum = z.enum(["active", "inactive", "pending"]);
export type StatusEnum = z.infer<typeof StatusEnum>;

const MimeTypes = {
  "application/pdf": "application/pdf",
  "image/jpg": "image/jpg",
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "text/csv": "text/csv",
} as const;
export const MimeTypeEnum = z.nativeEnum(MimeTypes);
export type MimeTypeEnum = z.infer<typeof MimeTypeEnum>;
