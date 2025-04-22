import { relations } from "drizzle-orm";
import { pgTable, serial, uuid, text, timestamp } from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import { adoption_posts } from "./adoption_posts";
import { customers } from "./customers";

export const adoption_applications = pgTable("adoption_applications", {
  id: serial("id").primaryKey(),
  adoption_post_id: uuid("adoption_post_id").references(
    () => adoption_posts.id
  ),
  applicant_id: uuid("applicant_id").references(() => customers.id),
  message: text("message"),
  application_date: timestamp("application_date").defaultNow().notNull(),
  ...timestamps,
});

export const adoption_applicationsRelations = relations(
  adoption_applications,
  ({ one }) => ({
    adoption_post: one(adoption_posts, {
      fields: [adoption_applications.adoption_post_id],
      references: [adoption_posts.id],
    }),
    applicant: one(customers, {
      fields: [adoption_applications.applicant_id],
      references: [customers.id],
    }),
  })
);
