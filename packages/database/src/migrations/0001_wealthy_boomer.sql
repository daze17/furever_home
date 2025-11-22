ALTER TABLE "adoption_posts" ALTER COLUMN "pet_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "customer_accounts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "customer_accounts" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "favorites" ALTER COLUMN "pet_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "pet_images" ALTER COLUMN "pet_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "pet_medical_records" ALTER COLUMN "pet_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "pets" ALTER COLUMN "id" DROP DEFAULT;