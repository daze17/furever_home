import {
  pgTable,
  text,
  uuid,
  varchar,
  boolean,
  date,
  serial,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";

import { timestamps } from "./time_stamps";
import {
  gender,
  status,
  pet_status,
  size,
  species,
  transaction_status,
  application_status,
  energy_level,
  friendliness,
  training_level,
} from "./enums";

// ============================================================
// CUSTOMER TABLES
// ============================================================

/**
 * Main customer/user profile table
 */
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  nickname: text("nickname"),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  profile_image_url: text("profile_image_url"),
  gender: gender("gender").default("other").notNull(),
  zip_code: text("zip_code"),
  ...timestamps,
});

/**
 * Customer authentication accounts
 * Separate from customers table to isolate auth logic
 */
export const customer_accounts = pgTable("customer_accounts", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  email: text("email").notNull().unique(),
  hash: text("hash").notNull(),
  status: status("status").notNull(),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "cascade",
  }),
  ...timestamps,
});

/**
 * Customer notification preferences
 */
export const customer_settings = pgTable("customer_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  receive_email_notification: boolean("receive_email_notification").default(
    true,
  ),
  receive_sms_notification: boolean("receive_sms_notification").default(true),
  customer_id: uuid("customer_id").references(() => customers.id),
  ...timestamps,
});

/**
 * Customer preferences for pet adoption
 * Helps match customers with suitable pets
 */
export const pet_preferences = pgTable("pet_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  customer_id: uuid("customer_id").references(() => customers.id),
  preferred_species: species("preferred_species").array(),
  preferred_size: size("preferred_size").array(),
  has_children: boolean("has_children").default(false),
  has_other_pets: boolean("has_other_pets").default(false),
  ...timestamps,
});

// ============================================================
// PET TABLES
// ============================================================

/**
 * Extra information about pets
 * Behavioral traits, training, and special needs
 */
export const pet_extra_informations = pgTable("pet_extra_information", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Behavioral traits
  energy_level: energy_level("energy_level"),
  friendliness_with_children: friendliness("friendliness_with_children"),
  friendliness_with_pets: friendliness("friendliness_with_pets"),

  // Training
  is_house_trained: boolean("is_house_trained").default(false).notNull(),
  training_level: training_level("training_level"),

  // Special needs
  special_needs: text("special_needs"),
  dietary_restrictions: text("dietary_restrictions"),

  ...timestamps,
});

/**
 * Main pet information table
 */
export const pets = pgTable(
  "pets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    birth_date: date("birth_date"),
    species: species("species").notNull(),
    notes: text("notes"),
    pet_image_url: text("pet_image_url"),
    size: size("size"),
    pet_status: pet_status("pet_status").notNull(),
    customer_id: uuid("customer_id")
      .references(() => customers.id, {
        onDelete: "set null",
      })
      .notNull(),
    pet_extra_information_id: uuid("pet_extra_information_id").references(
      () => pet_extra_informations.id,
      {
        onDelete: "set null",
      },
    ),
    ...timestamps,
  },
  (table) => {
    return {
      statusIdx: index("pet_status_idx").on(table.pet_status),
      speciesIdx: index("pet_species_idx").on(table.species),
      customerIdx: index("pet_customer_idx").on(table.customer_id),
    };
  },
);

/**
 * Pet medical records and health information
 * Important for adoption decisions
 */
export const pet_medical_records = pgTable("pet_medical_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  pet_id: uuid("pet_id")
    .references(() => pets.id, {
      onDelete: "cascade",
    })
    .notNull(),
  vaccination_name: text("vaccination_name"),
  vaccination_date: date("vaccination_date"),
  next_vaccination_date: date("next_vaccination_date"),
  is_spayed_neutered: boolean("is_spayed_neutered").default(false).notNull(),
  medical_notes: text("medical_notes"),
  allergies: text("allergies"),
  ...timestamps,
});

/**
 * Multiple images per pet
 * Allows gallery view of pet photos
 */
export const pet_images = pgTable(
  "pet_images",
  {
    id: serial("id").primaryKey(),
    pet_id: uuid("pet_id")
      .references(() => pets.id, {
        onDelete: "cascade",
      })
      .notNull(),
    image_url: text("image_url").notNull(),
    is_primary: boolean("is_primary").default(false).notNull(),
    display_order: integer("display_order").default(0).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      petIdx: index("pet_image_pet_idx").on(table.pet_id),
      isPrimaryIdx: index("pet_image_is_primary_idx").on(table.is_primary),
    };
  },
);

// ============================================================
// ADOPTION TABLES
// ============================================================

/**
 * Public adoption post listings
 * Pets available for adoption
 */
export const adoption_posts = pgTable(
  "adoption_posts",
  {
    id: serial("id").primaryKey(),
    pet_id: uuid("pet_id")
      .references(() => pets.id, {
        onDelete: "cascade",
      })
      .notNull(),
    owner: uuid("owner")
      .references(() => customers.id, {
        onDelete: "cascade",
      })
      .notNull(),
    price: integer("price"),
    address: text("address"),
    contact: text("contact"),
    notes: text("notes"),
    post_status: status("post_status").default("active").notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      statusIdx: index("adoption_post_status_idx").on(table.post_status),
      petIdx: index("adoption_post_pet_idx").on(table.pet_id),
      ownerIdx: index("adoption_post_owner_idx").on(table.owner),
    };
  },
);

/**
 * Adoption applications from potential adopters
 * Tracks interest in specific pets with workflow status
 */
export const adoption_applications = pgTable(
  "adoption_applications",
  {
    id: serial("id").primaryKey(),
    adoption_post_id: integer("adoption_post_id")
      .references(() => adoption_posts.id, {
        onDelete: "cascade",
      })
      .notNull(),
    applicant_id: uuid("applicant_id")
      .references(() => customers.id, {
        onDelete: "cascade",
      })
      .notNull(),
    message: text("message"),
    application_date: timestamp("application_date").defaultNow().notNull(),
    application_status: application_status("application_status")
      .default("pending")
      .notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      statusIdx: index("adoption_application_status_idx").on(
        table.application_status,
      ),
      postIdx: index("adoption_application_post_idx").on(
        table.adoption_post_id,
      ),
      applicantIdx: index("adoption_application_applicant_idx").on(
        table.applicant_id,
      ),
    };
  },
);

/**
 * Completed adoption transactions
 * Permanent record of pet ownership transfers
 */
export const adoption_transactions = pgTable("adoption_transactions", {
  id: serial("id").primaryKey(),
  adoption_post_id: integer("adoption_post_id").references(
    () => adoption_posts.id,
  ),
  old_user_id: uuid("old_user_id").references(() => customers.id),
  new_user_id: uuid("new_user_id").references(() => customers.id),
  transaction_date: timestamp("transaction_date").defaultNow().notNull(),
  transaction_status: transaction_status("transaction_status").notNull(),
  ...timestamps,
});

/**
 * Post-adoption reviews
 * Allows adopters to rate and review their experience
 */
export const adoption_reviews = pgTable("adoption_reviews", {
  id: serial("id").primaryKey(),
  adoption_transaction_id: integer("adoption_transaction_id")
    .references(() => adoption_transactions.id, {
      onDelete: "cascade",
    })
    .notNull(),
  reviewer_id: uuid("reviewer_id")
    .references(() => customers.id, {
      onDelete: "cascade",
    })
    .notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  review_text: text("review_text"),
  ...timestamps,
});

// ============================================================
// COMMUNICATION & FAVORITES
// ============================================================

/**
 * Messages between adopters and owners
 * In-app communication for adoption applications
 */
export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    adoption_application_id: integer("adoption_application_id")
      .references(() => adoption_applications.id, {
        onDelete: "cascade",
      })
      .notNull(),
    sender_id: uuid("sender_id")
      .references(() => customers.id, {
        onDelete: "cascade",
      })
      .notNull(),
    message_text: text("message_text").notNull(),
    is_read: boolean("is_read").default(false).notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      applicationIdx: index("message_application_idx").on(
        table.adoption_application_id,
      ),
      senderIdx: index("message_sender_idx").on(table.sender_id),
      isReadIdx: index("message_is_read_idx").on(table.is_read),
    };
  },
);

/**
 * User favorites/wishlist
 * Allows users to save pets they're interested in
 */
export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    customer_id: uuid("customer_id")
      .references(() => customers.id, {
        onDelete: "cascade",
      })
      .notNull(),
    pet_id: uuid("pet_id")
      .references(() => pets.id, {
        onDelete: "cascade",
      })
      .notNull(),
    ...timestamps,
  },
  (table) => {
    return {
      // Prevent duplicate favorites
      uniqueFavorite: unique("unique_favorite").on(
        table.customer_id,
        table.pet_id,
      ),
      customerIdx: index("favorite_customer_idx").on(table.customer_id),
      petIdx: index("favorite_pet_idx").on(table.pet_id),
    };
  },
);
