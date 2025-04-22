import { relations } from "drizzle-orm";
import { pgTable, uuid, text, date, boolean } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { pets } from "./pets";

export const pet_medical_records = pgTable("pet_medical_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  pet_id: uuid("pet_id").references(() => pets.id),
  vaccination_name: text("vaccination_name"),
  vaccination_date: date("vaccination_date"),
  next_vaccination_date: date("next_vaccination_date"),
  is_spayed_neutered: boolean("is_spayed_neutered").default(false),
  medical_notes: text("medical_notes"),
  allergies: text("allergies"),
  ...timestamps,
});

export const pet_medical_recordsRelations = relations(
  pet_medical_records,
  ({ one }) => ({
    pet: one(pets, {
      fields: [pet_medical_records.pet_id],
      references: [pets.id],
    }),
  })
);
