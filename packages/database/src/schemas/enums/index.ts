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
