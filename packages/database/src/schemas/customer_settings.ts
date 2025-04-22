import { relations } from "drizzle-orm";
import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { customers } from "./customers";

export const customer_settings = pgTable("customer_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  receive_email_notification: boolean("receive_email_notification").default(
    true
  ),
  receive_sms_notification: boolean("receive_sms_notification").default(true),
  customer_id: uuid("customer_id").references(() => customers.id),
  ...timestamps,
});
export const customer_settingsRelations = relations(
  customer_settings,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customer_settings.customer_id],
      references: [customers.id],
    }),
  })
);
