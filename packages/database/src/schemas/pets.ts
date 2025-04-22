import { relations } from "drizzle-orm";
import { pgTable, text, date, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { pet_status, size, species } from "./enums";
import { customers } from "./customers";
import { pet_extra_informations } from "./pet_extra_informations";

export const pets = pgTable("pets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  birth_date: date("birth_date"),
  species: species("species").notNull(),
  notes: text("notes"),
  pet_image_url: text("pet_image_url"),
  size: size("size"),
  pet_status: pet_status("pet_status").notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  pet_extra_information_id: uuid("pet_extra_information_id").references(
    () => pet_extra_informations.id
  ),
  ...timestamps,
});

export const petsRelations = relations(pets, ({ one }) => ({
  customer: one(customers, {
    fields: [pets.customerId],
    references: [customers.id],
  }),
  pet_extra_information: one(pet_extra_informations, {
    fields: [pets.pet_extra_information_id],
    references: [pet_extra_informations.id],
  }),
}));
