import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { pets } from "./pets";
import { gender } from "./enums";
import { customer_settings } from "./customer_settings";

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  nickname: text("nickname"),
  address: text("address"),
  phone: text("phone"),
  profile_image_url: text("profile_image_url"),
  gender: gender("gender").default("other"),
  zip_code: text("zip_code"),
  pets_ids: uuid("pets").references(() => pets.id),
  ...timestamps,
});

export const customersRelations = relations(customers, ({ many, one }) => ({
  pets: many(pets),
  customer_settings: one(customer_settings, {
    fields: [customers.id],
    references: [customer_settings.customer_id],
  }),
}));
