-- Rename favorites.pet_id to adoption_post_id
ALTER TABLE "favorites" RENAME COLUMN "pet_id" TO "adoption_post_id";--> statement-breakpoint

-- Drop the existing foreign key constraint on favorites (to pets)
ALTER TABLE "favorites" DROP CONSTRAINT IF EXISTS "favorites_pet_id_pets_id_fk";--> statement-breakpoint

-- Add the correct foreign key constraint (to adoption_posts)
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_adoption_post_id_adoption_posts_id_fk"
  FOREIGN KEY ("adoption_post_id") REFERENCES "adoption_posts"("id") ON DELETE CASCADE;--> statement-breakpoint

-- Update the unique constraint name to match
ALTER TABLE "favorites" DROP CONSTRAINT IF EXISTS "unique_favorite";--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "unique_favorite" UNIQUE ("customer_id", "adoption_post_id");--> statement-breakpoint

-- Fix pets table: change customer_id foreign key from SET NULL to CASCADE
ALTER TABLE "pets" DROP CONSTRAINT IF EXISTS "pets_customer_id_customers_id_fk";--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_customer_id_customers_id_fk"
  FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE;
