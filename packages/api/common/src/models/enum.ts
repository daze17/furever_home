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
