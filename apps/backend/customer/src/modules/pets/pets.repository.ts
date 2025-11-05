import { Inject, Injectable } from "@nestjs/common";
import { CreatePetRequestBody, UpdatePetRequestBody } from "customer_api";
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

  async createPet(data: CreatePetRequestBody) {
    const [pet] = await this.db
      .insert(pets)
      .values({
        name: data.name,
        birth_date: data.birth_date,
        species: data.species,
        notes: data.notes,
        pet_image_url: data.pet_image_url,
        size: data.size,
        pet_status: data.pet_status,
        customer_id: data.customer_id,
        pet_extra_information_id: data.pet_extra_information_id,
      })
      .returning();

    return pet;
  }

  async listPets(filters: ListPetsFilters) {
    const conditions = [];

    if (filters.customer_id) {
      conditions.push(eq(pets.customer_id, filters.customer_id));
    }

    if (filters.species) {
      conditions.push(eq(pets.species, filters.species as any));
    }

    if (filters.pet_status) {
      conditions.push(eq(pets.pet_status, filters.pet_status as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [petsResult, totalResult] = await Promise.all([
      this.db.query.pets.findMany({
        where: whereClause,
        limit: filters.limit || 50,
        offset: filters.offset || 0,
        orderBy: (pets, { desc }) => [desc(pets.created_at)],
      }),
      this.db
        .select({ count: sql<number>`count(*)` })
        .from(pets)
        .where(whereClause),
    ]);

    return {
      pets: petsResult,
      total: Number(totalResult[0]?.count || 0),
    };
  }

  async getPetById(id: string) {
    const pet = await this.db.query.pets.findFirst({
      where: eq(pets.id, id),
    });

    return pet || null;
  }

  async updatePet(id: string, data: UpdatePetRequestBody) {
    const [updatedPet] = await this.db
      .update(pets)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(pets.id, id))
      .returning();

    return updatedPet || null;
  }

  async deletePet(id: string) {
    const [deletedPet] = await this.db
      .delete(pets)
      .where(eq(pets.id, id))
      .returning();

    return deletedPet || null;
  }
}
