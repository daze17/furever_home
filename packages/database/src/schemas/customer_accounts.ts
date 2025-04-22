import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { customers } from "./customers";
import { status } from "./enums";

export const customer_accounts = pgTable("customer_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  hash: text("hash").notNull(),
  status: status("status").notNull(),
  customerId: uuid("customer_id").references(() => customers.id),
  ...timestamps,
});

export const customer_accountsRelations = relations(
  customer_accounts,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customer_accounts.customerId],
      references: [customers.id],
    }),
  })
);
