import { relations } from "drizzle-orm";
import { pgTable, uuid, boolean } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { customers } from "./customers";
import { size, species } from "./enums";

export const pet_preferences = pgTable("pet_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  customer_id: uuid("customer_id").references(() => customers.id),
  preferred_species: species("preferred_species").array(),
  preferred_size: size("preferred_size").array(),
  has_children: boolean("has_children").default(false),
  has_other_pets: boolean("has_other_pets").default(false),
  ...timestamps,
});

export const pet_preferencesRelations = relations(
  pet_preferences,
  ({ one }) => ({
    customer: one(customers, {
      fields: [pet_preferences.customer_id],
      references: [customers.id],
    }),
  })
);
