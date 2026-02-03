ALTER TABLE "favorites" RENAME COLUMN "pet_id" TO "adoption_post_id";--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "unique_favorite";--> statement-breakpoint
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_pet_id_pets_id_fk";
--> statement-breakpoint
ALTER TABLE "pets" DROP CONSTRAINT "pets_customer_id_customers_id_fk";
--> statement-breakpoint
DROP INDEX "favorite_pet_idx";--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_adoption_post_id_adoption_posts_id_fk" FOREIGN KEY ("adoption_post_id") REFERENCES "public"."adoption_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pets" ADD CONSTRAINT "pets_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "favorite_post_idx" ON "favorites" USING btree ("adoption_post_id");--> statement-breakpoint
ALTER TABLE "pets" DROP COLUMN "pet_image_url";--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "unique_favorite" UNIQUE("customer_id","adoption_post_id");