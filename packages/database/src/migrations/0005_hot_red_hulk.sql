CREATE TABLE "vaccinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"medical_record_id" uuid NOT NULL,
	"name" text NOT NULL,
	"date" date NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vaccinations" ADD CONSTRAINT "vaccinations_medical_record_id_pet_medical_records_id_fk" FOREIGN KEY ("medical_record_id") REFERENCES "public"."pet_medical_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pet_medical_records" DROP COLUMN "vaccination_name";--> statement-breakpoint
ALTER TABLE "pet_medical_records" DROP COLUMN "vaccination_date";--> statement-breakpoint
ALTER TABLE "pet_medical_records" DROP COLUMN "next_vaccination_date";