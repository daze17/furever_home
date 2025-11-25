import { Inject, Injectable } from "@nestjs/common";
import {
  CreatePetExtraInformationRequestBody,
  CreatePetRequestBody,
  PetsQuery,
} from "customer_api";
import { pet_extra_informations, pets } from "database";
import { and, asc, SQL } from "drizzle-orm";
import { count } from "drizzle-orm";
import { desc } from "drizzle-orm";

import type { Database } from "@/modules/database/database.providers";

@Injectable()
export class PetsRepository {
  constructor(@Inject("DATABASE") private readonly db: Database) {}

  async createPet(
    customerId: string,
    petExtraInformationId: string,
    data: CreatePetRequestBody,
  ) {
    const {
      name,
      birth_date,
      species,
      notes,
      pet_image_url,
      size,
      pet_status,
      pet_extra_information,
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
      pet_extra_information_id: petExtraInformationId,
    });
  }

  async createPetExtraInformation(data: CreatePetExtraInformationRequestBody) {
    const {
      energy_level,
      friendliness_with_children,
      friendliness_with_pets,
      is_house_trained,
      training_level,
      special_needs,
      dietary_restrictions,
    } = data;

    const createdPetExtraInformation = await this.db
      .insert(pet_extra_informations)
      .values({
        energy_level,
        friendliness_with_children,
        friendliness_with_pets,
        is_house_trained,
        training_level,
        special_needs,
        dietary_restrictions,
      })
      .returning();
    return createdPetExtraInformation.find(Boolean)!.id;
  }

  async createPetAndPetExtraInformations(
    customerId: string,
    data: CreatePetRequestBody,
  ) {
    await this.db.transaction(async (transaction) => {
      const {
        name,
        birth_date,
        species,
        notes,
        pet_image_url,
        size,
        pet_status,
        pet_extra_information,
      } = data;

      const {
        energy_level,
        friendliness_with_children,
        friendliness_with_pets,
        is_house_trained,
        training_level,
        special_needs,
        dietary_restrictions,
      } = pet_extra_information;

      const createdPetExtraInformation = await transaction
        .insert(pet_extra_informations)
        .values({
          energy_level,
          friendliness_with_children,
          friendliness_with_pets,
          is_house_trained,
          training_level,
          special_needs,
          dietary_restrictions,
        })
        .returning();

      await transaction.insert(pets).values({
        name,
        birth_date,
        species,
        notes,
        pet_image_url,
        size,
        pet_status,
        customer_id: customerId,
        pet_extra_information_id: createdPetExtraInformation.find(Boolean)!.id,
      });
    });
  }

  async getPetsList(query: PetsQuery = {}) {
    const currentPage = query.current_page ?? 1;
    const perPage = query.per_page ?? 10;

    const where = and(...this.mapPetsQuery(query));

    const _pets = await this.db.query.pets.findMany({
      with: {
        pet_extra_information: true,
      },
      where,
      orderBy: (query.sorting_order === "ascending" ? asc : desc)(
        this.mapPetsSortingField(query.sorting_field),
      ),
      // When provided as 0, it returns all rows without pagination
      offset: currentPage === 0 ? undefined : (currentPage - 1) * perPage,
      limit: perPage === 0 ? undefined : perPage,
    });

    const _count = await this.db
      .select({ total: count() })
      .from(pets)
      .where(where);

    const total = _count.find(Boolean)?.total ?? 0;

    return {
      data: _pets,
      meta: {
        total,
        per_page: perPage,
        current_page: currentPage,
      },
    };
  }

  private mapPetsQuery(query: PetsQuery = {}) {
    const conditions: SQL<unknown | undefined>[] = [];

    const {
      //
    } = query;

    return conditions;
  }

  private mapPetsSortingField(field: NonNullable<PetsQuery>["sorting_field"]) {
    switch (field) {
      // case "pets_id":
      //   return pets.id;
      case "created_at":
        return pets.created_at;
      default:
        return pets.created_at;
    }
  }
}
