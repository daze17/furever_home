import { relations } from "drizzle-orm";
import { pgTable, text, serial, uuid, integer } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { customers } from "./customers";
import { pets } from "./pets";
import { status } from "./enums";

export const adoption_posts = pgTable("adoption_posts", {
  id: serial("id").primaryKey(),
  pet_id: uuid("pet_id").references(() => pets.id),
  owner: uuid("owner").references(() => customers.id),
  price: integer("price"),
  address: text("address"),
  contact: text("contact"),
  notes: text("notes"),
  ...timestamps,
});

export const adoption_postsRelations = relations(adoption_posts, ({ one }) => ({
  pet: one(pets, {
    fields: [adoption_posts.pet_id],
    references: [pets.id],
  }),
  owner: one(customers, {
    fields: [adoption_posts.owner],
    references: [customers.id],
  }),
}));
