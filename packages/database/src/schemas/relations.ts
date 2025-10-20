import { relations } from "drizzle-orm";

import {
  customers,
  customer_accounts,
  customer_settings,
  pet_preferences,
  pets,
  pet_extra_informations,
  pet_medical_records,
  pet_images,
  adoption_posts,
  adoption_applications,
  adoption_transactions,
  adoption_reviews,
  messages,
  favorites,
} from "./schemas";

// ============================================================
// CUSTOMER RELATIONS
// ============================================================

/**
 * Customer Relations:
 * - Has many pets (one-to-many)
 * - Has one customer_settings (one-to-one)
 */
export const customersRelations = relations(customers, ({ many, one }) => ({
  pets: many(pets),
  customer_settings: one(customer_settings, {
    fields: [customers.id],
    references: [customer_settings.customer_id],
  }),
}));

/**
 * Customer Account Relations:
 * - Belongs to one customer (many-to-one)
 */
export const customer_accountsRelations = relations(
  customer_accounts,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customer_accounts.customerId],
      references: [customers.id],
    }),
  }),
);

/**
 * Customer Settings Relations:
 * - Belongs to one customer (one-to-one)
 */
export const customer_settingsRelations = relations(
  customer_settings,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customer_settings.customer_id],
      references: [customers.id],
    }),
  }),
);

/**
 * Pet Preferences Relations:
 * - Belongs to one customer (many-to-one)
 */
export const pet_preferencesRelations = relations(
  pet_preferences,
  ({ one }) => ({
    customer: one(customers, {
      fields: [pet_preferences.customer_id],
      references: [customers.id],
    }),
  }),
);

// ============================================================
// PET RELATIONS
// ============================================================

/**
 * Pet Extra Informations Relations:
 * - Has one pet (one-to-one)
 */
export const pet_extra_informationsRelations = relations(
  pet_extra_informations,
  ({ one }) => ({
    pet: one(pets, {
      fields: [pet_extra_informations.id],
      references: [pets.pet_extra_information_id],
    }),
  }),
);

/**
 * Pets Relations:
 * - Belongs to one customer (owner) (many-to-one)
 * - Has one pet_extra_information (one-to-one)
 */
export const petsRelations = relations(pets, ({ one }) => ({
  customer: one(customers, {
    fields: [pets.customer_id],
    references: [customers.id],
  }),
  pet_extra_information: one(pet_extra_informations, {
    fields: [pets.pet_extra_information_id],
    references: [pet_extra_informations.id],
  }),
}));

/**
 * Pet Medical Records Relations:
 * - Belongs to one pet (many-to-one)
 */
export const pet_medical_recordsRelations = relations(
  pet_medical_records,
  ({ one }) => ({
    pet: one(pets, {
      fields: [pet_medical_records.pet_id],
      references: [pets.id],
    }),
  }),
);

/**
 * Pet Images Relations:
 * - Belongs to one pet (many-to-one)
 */
export const pet_imagesRelations = relations(pet_images, ({ one }) => ({
  pet: one(pets, {
    fields: [pet_images.pet_id],
    references: [pets.id],
  }),
}));

// ============================================================
// ADOPTION RELATIONS
// ============================================================

/**
 * Adoption Posts Relations:
 * - References one pet (many-to-one)
 * - References one customer as owner (many-to-one)
 */
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

/**
 * Adoption Applications Relations:
 * - Belongs to one adoption_post (many-to-one)
 * - References one customer as applicant (many-to-one)
 */
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
  }),
);

/**
 * Adoption Transactions Relations:
 * - Belongs to one adoption_post (many-to-one)
 * - References one customer as old_user (previous owner) (many-to-one)
 * - References one customer as new_user (new owner) (many-to-one)
 */
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
  }),
);

/**
 * Adoption Reviews Relations:
 * - Belongs to one adoption_transaction (many-to-one)
 * - References one customer as reviewer (many-to-one)
 */
export const adoption_reviewsRelations = relations(
  adoption_reviews,
  ({ one }) => ({
    adoption_transaction: one(adoption_transactions, {
      fields: [adoption_reviews.adoption_transaction_id],
      references: [adoption_transactions.id],
    }),
    reviewer: one(customers, {
      fields: [adoption_reviews.reviewer_id],
      references: [customers.id],
    }),
  }),
);

// ============================================================
// COMMUNICATION & FAVORITES RELATIONS
// ============================================================

/**
 * Messages Relations:
 * - Belongs to one adoption_application (many-to-one)
 * - References one customer as sender (many-to-one)
 */
export const messagesRelations = relations(messages, ({ one }) => ({
  adoption_application: one(adoption_applications, {
    fields: [messages.adoption_application_id],
    references: [adoption_applications.id],
  }),
  sender: one(customers, {
    fields: [messages.sender_id],
    references: [customers.id],
  }),
}));

/**
 * Favorites Relations:
 * - Belongs to one customer (many-to-one)
 * - References one pet (many-to-one)
 */
export const favoritesRelations = relations(favorites, ({ one }) => ({
  customer: one(customers, {
    fields: [favorites.customer_id],
    references: [customers.id],
  }),
  pet: one(pets, {
    fields: [favorites.pet_id],
    references: [pets.id],
  }),
}));
