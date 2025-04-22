import { relations } from "drizzle-orm";
import { pgTable, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { pets } from "./pets";

export const pet_extra_informations = pgTable("pet_extra_information", {
  id: uuid("id").defaultRandom().primaryKey(),
  ...timestamps,
});
export const pet_extra_informationsRelations = relations(
  pet_extra_informations,
  ({ one }) => ({
    pet: one(pets, {
      fields: [pet_extra_informations.id],
      references: [pets.pet_extra_information_id],
    }),
  })
);
