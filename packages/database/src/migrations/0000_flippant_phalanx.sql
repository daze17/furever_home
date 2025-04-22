CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."pet_status" AS ENUM('adopting', 'has_owner', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."size" AS ENUM('small', 'medium', 'large');--> statement-breakpoint
CREATE TYPE "public"."species" AS ENUM('dog', 'cat', 'bird', 'fish', 'other');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'pending');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "adoption_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"adoption_post_id" uuid,
	"applicant_id" uuid,
	"message" text,
	"application_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adoption_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"pet_id" uuid,
	"owner" uuid,
	"price" integer,
	"address" text,
	"contact" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "adoption_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"adoption_post_id" uuid,
	"old_user_id" uuid,
	"new_user_id" uuid,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"transaction_status" "transaction_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"hash" text NOT NULL,
	"status" "status" NOT NULL,
	"customer_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
	"first_name" text,
	"last_name" text,
	"nickname" text,
	"address" text,
	"phone" text,
	"profile_image_url" text,
	"gender" "gender" DEFAULT 'other',
	"zip_code" text,
	"pets" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_extra_information" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pet_medical_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pet_id" uuid,
	"vaccination_name" text,
	"vaccination_date" date,
	"next_vaccination_date" date,
	"is_spayed_neutered" boolean DEFAULT false,
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
	"name" text,
	"birth_date" date,
	"species" "species" NOT NULL,
	"notes" text,
	"pet_image_url" text,
	"size" "size",
	"pet_status" "pet_status" NOT NULL,
	"customer_id" uuid,
	"pet_extra_information_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adoption_applications" ADD CONSTRAINT "adoption_applications_adoption_post_id_adoption_posts_id_fk" FOREIGN KEY ("adoption_post_id") REFERENCES "public"."adoption_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_applications" ADD CONSTRAINT "adoption_applications_applicant_id_customers_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_posts" ADD CONSTRAINT "adoption_posts_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_posts" ADD CONSTRAINT "adoption_posts_owner_customers_id_fk" FOREIGN KEY ("owner") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_transactions" ADD CONSTRAINT "adoption_transactions_adoption_post_id_adoption_posts_id_fk" FOREIGN KEY ("adoption_post_id") REFERENCES "public"."adoption_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_transactions" ADD CONSTRAINT "adoption_transactions_old_user_id_customers_id_fk" FOREIGN KEY ("old_user_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adoption_transactions" ADD CONSTRAINT "adoption_transactions_new_user_id_customers_id_fk" FOREIGN KEY ("new_user_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_accounts" ADD CONSTRAINT "customer_accounts_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_settings" ADD CONSTRAINT "customer_settings_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_pets_pets_id_fk" FOREIGN KEY ("pets") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_medical_records" ADD CONSTRAINT "pet_medical_records_pet_id_pets_id_fk" FOREIGN KEY ("pet_id") REFERENCES "public"."pets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_preferences" ADD CONSTRAINT "pet_preferences_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_pet_extra_information_id_pet_extra_information_id_fk" FOREIGN KEY ("pet_extra_information_id") REFERENCES "public"."pet_extra_information"("id") ON DELETE no action ON UPDATE no action;