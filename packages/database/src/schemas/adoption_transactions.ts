import { relations } from "drizzle-orm";
import { pgTable, serial, uuid, timestamp, integer } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { adoption_posts } from "./adoption_posts";
import { transaction_status } from "./enums";
import { customers } from "./customers";

export const adoption_transactions = pgTable("adoption_transactions", {
  id: serial("id").primaryKey(),
  adoption_post_id: integer("adoption_post_id").references(
    () => adoption_posts.id
  ),
  old_user_id: uuid("old_user_id").references(() => customers.id),
  new_user_id: uuid("new_user_id").references(() => customers.id),
  transaction_date: timestamp("transaction_date").defaultNow().notNull(),
  transaction_status: transaction_status("transaction_status").notNull(),
  ...timestamps,
});

export const adoption_transactionsRelations = relations(
  adoption_transactions,
  ({ one }) => ({
    adoption_post: one(adoption_posts, {
      fields: [adoption_transactions.adoption_post_id],
      references: [adoption_posts.id],
    }),
    old_user: one(customers, {
      fields: [adoption_transactions.old_user_id],
      references: [customers.id],
    }),
    new_user: one(customers, {
      fields: [adoption_transactions.new_user_id],
      references: [customers.id],
    }),
  })
);
