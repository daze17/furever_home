import { Inject, Injectable } from "@nestjs/common";
import { CreatePetRequestBody } from "customer_api";
import { pets } from "database";
import { and, eq, sql } from "drizzle-orm";

import type { Database } from "@/modules/database/database.providers";

interface ListPetsFilters {
  customer_id?: string;
  species?: string;
  pet_status?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class PetsRepository {
  constructor(@Inject("DATABASE") private readonly db: Database) {}

  async createPet(customerId: string, data: CreatePetRequestBody) {
    const {
      name,
      birth_date,
      species,
      notes,
      pet_image_url,
      size,
      pet_status,
      pet_extra_information_id,
    } = data;

    await this.db.insert(pets).values({
      name,
      birth_date,
      species,
      notes,
      pet_image_url,
      size,
      pet_status,
      customer_id: customerId,
      pet_extra_information_id,
    });
  }

  // async listPets(filters: ListPetsFilters) {
  //   const conditions = [];

  //   if (filters.customer_id) {
  //     conditions.push(eq(pets.customer_id, filters.customer_id));
  //   }

  //   if (filters.species) {
  //     conditions.push(eq(pets.species, filters.species as any));
  //   }

  //   if (filters.pet_status) {
  //     conditions.push(eq(pets.pet_status, filters.pet_status as any));
  //   }

  //   const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  //   const [petsResult, totalResult] = await Promise.all([
  //     this.db.query.pets.findMany({
  //       where: whereClause,
  //       limit: filters.limit || 50,
  //       offset: filters.offset || 0,
  //       orderBy: (pets, { desc }) => [desc(pets.created_at)],
  //     }),
  //     this.db
  //       .select({ count: sql<number>`count(*)` })
  //       .from(pets)
  //       .where(whereClause),
  //   ]);

  //   return {
  //     pets: petsResult,
  //     total: Number(totalResult[0]?.count || 0),
  //   };
  // }

  // async getPetById(id: string) {
  //   const pet = await this.db.query.pets.findFirst({
  //     where: eq(pets.id, id),
  //   });

  //   return pet || null;
  // }

  // async updatePet(id: string, data: UpdatePetRequestBody) {
  //   const [updatedPet] = await this.db
  //     .update(pets)
  //     .set({
  //       ...data,
  //       updated_at: new Date(),
  //     })
  //     .where(eq(pets.id, id))
  //     .returning();

  //   return updatedPet || null;
  // }

  // async deletePet(id: string) {
  //   const [deletedPet] = await this.db
  //     .delete(pets)
  //     .where(eq(pets.id, id))
  //     .returning();

  //   return deletedPet || null;
  // }
}
