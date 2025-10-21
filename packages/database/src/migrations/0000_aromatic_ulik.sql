CREATE TYPE "public"."application_status" AS ENUM('pending', 'reviewing', 'approved', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."energy_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."friendliness" AS ENUM('poor', 'fair', 'good', 'excellent');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."pet_status" AS ENUM('adopting', 'has_owner', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."species" AS ENUM('dog', 'cat', 'bird', 'fish', 'other');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'pending');--> statement-breakpoint
CREATE TYPE "public"."training_level" AS ENUM('none', 'basic', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "adoption_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"adoption_post_id" integer NOT NULL,
	"applicant_id" uuid NOT NULL,
	"message" text,
	"application_date" timestamp DEFAULT now() NOT NULL,
	"application_status" "application_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adoption_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"owner" uuid NOT NULL,
	"price" integer,
	"address" text,
	"contact" text,
	"notes" text,
	"post_status" "status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adoption_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"adoption_transaction_id" integer NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adoption_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"adoption_post_id" integer,
	"old_user_id" uuid,
	"new_user_id" uuid,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"transaction_status" "transaction_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_accounts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"hash" text NOT NULL,
	"status" "status" NOT NULL,
	"customer_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "customer_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"receive_email_notification" boolean DEFAULT true,
	"receive_sms_notification" boolean DEFAULT true,
	"customer_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"nickname" text,
	"address" text,
	"phone" varchar(20),
	"profile_image_url" text,
	"gender" "gender" DEFAULT 'other' NOT NULL,
	"zip_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" uuid NOT NULL,
	"pet_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_favorite" UNIQUE("customer_id","pet_id")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"adoption_application_id" integer NOT NULL,
	"sender_id" uuid NOT NULL,
	"message_text" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_extra_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"energy_level" "energy_level",
	"friendliness_with_children" "friendliness",
	"friendliness_with_pets" "friendliness",
	"is_house_trained" boolean DEFAULT false NOT NULL,
	"training_level" "training_level",
	"special_needs" text,
	"dietary_restrictions" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_medical_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid NOT NULL,
	"vaccination_name" text,
	"vaccination_date" date,
	"next_vaccination_date" date,
	"is_spayed_neutered" boolean DEFAULT false NOT NULL,
	"medical_notes" text,
	"allergies" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid,
	"preferred_species" "species"[],
	"preferred_size" "size"[],
	"has_children" boolean DEFAULT false,
	"has_other_pets" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"birth_date" date,
	"species" "species" NOT NULL,
	"notes" text,
	"pet_image_url" text,
	"size" "size",
	"pet_status" "pet_status" NOT NULL,
	"customer_id" uuid NOT NULL,
	"pet_extra_information_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adoption_applications" ADD CONSTRAINT "adoption_applications_adoption_post_id_adoption_posts_id_fk" FOREIGN KEY ("adoption_post_id") REFERENCES "public"."adoption_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_applications" ADD CONSTRAINT "adoption_applications_applicant_id_customers_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_posts" ADD CONSTRAINT "adoption_posts_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_posts" ADD CONSTRAINT "adoption_posts_owner_customers_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_reviews" ADD CONSTRAINT "adoption_reviews_adoption_transaction_id_adoption_transactions_id_fk" FOREIGN KEY ("adoption_transaction_id") REFERENCES "public"."adoption_transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_reviews" ADD CONSTRAINT "adoption_reviews_reviewer_id_customers_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_transactions" ADD CONSTRAINT "adoption_transactions_adoption_post_id_adoption_posts_id_fk" FOREIGN KEY ("adoption_post_id") REFERENCES "public"."adoption_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_transactions" ADD CONSTRAINT "adoption_transactions_old_user_id_customers_id_fk" FOREIGN KEY ("old_user_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_transactions" ADD CONSTRAINT "adoption_transactions_new_user_id_customers_id_fk" FOREIGN KEY ("new_user_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_accounts" ADD CONSTRAINT "customer_accounts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_settings" ADD CONSTRAINT "customer_settings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_adoption_application_id_adoption_applications_id_fk" FOREIGN KEY ("adoption_application_id") REFERENCES "public"."adoption_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_customers_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_medical_records" ADD CONSTRAINT "pet_medical_records_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_preferences" ADD CONSTRAINT "pet_preferences_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_pet_extra_information_id_pet_extra_information_id_fk" FOREIGN KEY ("pet_extra_information_id") REFERENCES "public"."pet_extra_information"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "adoption_application_status_idx" ON "adoption_applications" USING btree ("application_status");--> statement-breakpoint
CREATE INDEX "adoption_application_post_idx" ON "adoption_applications" USING btree ("adoption_post_id");--> statement-breakpoint
CREATE INDEX "adoption_application_applicant_idx" ON "adoption_applications" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "adoption_post_status_idx" ON "adoption_posts" USING btree ("post_status");--> statement-breakpoint
CREATE INDEX "adoption_post_pet_idx" ON "adoption_posts" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "adoption_post_owner_idx" ON "adoption_posts" USING btree ("owner");--> statement-breakpoint
CREATE INDEX "favorite_customer_idx" ON "favorites" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "favorite_pet_idx" ON "favorites" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "message_application_idx" ON "messages" USING btree ("adoption_application_id");--> statement-breakpoint
CREATE INDEX "message_sender_idx" ON "messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "message_is_read_idx" ON "messages" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "pet_image_pet_idx" ON "pet_images" USING btree ("pet_id");--> statement-breakpoint
CREATE INDEX "pet_image_is_primary_idx" ON "pet_images" USING btree ("is_primary");--> statement-breakpoint
CREATE INDEX "pet_status_idx" ON "pets" USING btree ("pet_status");--> statement-breakpoint
CREATE INDEX "pet_species_idx" ON "pets" USING btree ("species");--> statement-breakpoint
CREATE INDEX "pet_customer_idx" ON "pets" USING btree ("customer_id");