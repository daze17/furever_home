import { pgEnum } from "drizzle-orm/pg-core";

export const size = pgEnum("size", ["small", "medium", "large"]);
export const status = pgEnum("status", ["active", "inactive", "pending"]);
export const transaction_status = pgEnum("transaction_status", [
  "pending",
  "completed",
  "failed",
]);
export const species = pgEnum("species", [
  "dog",
  "cat",
  "bird",
  "fish",
  "other",
]);
export const gender = pgEnum("gender", ["male", "female", "other"]);
export const pet_status = pgEnum("pet_status", [
  "adopting",
  "has_owner",
  "inactive",
]);

// New enums for adoption applications
export const application_status = pgEnum("application_status", [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "withdrawn",
]);

// New enums for pet extra information
export const energy_level = pgEnum("energy_level", ["low", "medium", "high"]);
export const friendliness = pgEnum("friendliness", [
  "poor",
  "fair",
  "good",
  "excellent",
]);
export const training_level = pgEnum("training_level", [
  "none",
  "basic",
  "intermediate",
  "advanced",
]);
