import { Inject, Injectable } from "@nestjs/common";
import { PetStatusEnum } from "common_api";
import {
  CreatePetExtraInformationRequestBody,
  CreatePetRequestBody,
  PetsQuery,
} from "customer_api";
import { pet_extra_informations, pet_images, pets } from "database";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  SQL,
} from "drizzle-orm";

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
      size,
      pet_status,
      pet_extra_information,
    } = data;

    await this.db.insert(pets).values({
      name,
      birth_date,
      species,
      notes,
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
    return await this.db.transaction(async (transaction) => {
      const {
        name,
        birth_date,
        species,
        notes,
        size,
        pet_status,
        pet_extra_information,
        image_urls,
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

      const [createdPet] = await transaction
        .insert(pets)
        .values({
          name,
          birth_date,
          species,
          notes,
          size,
          pet_status,
          customer_id: customerId,
          pet_extra_information_id: createdPetExtraInformation.find(Boolean)!.id,
        })
        .returning({ id: pets.id });

      // Create pet_images if URLs provided
      if (image_urls && image_urls.length > 0) {
        await transaction.insert(pet_images).values(
          image_urls.map((url, index) => ({
            pet_id: createdPet!.id,
            image_url: url,
            is_primary: index === 0,
            display_order: index,
          })),
        );
      }

      return createdPet!.id;
    });
  }

  async getOwnPetsList(customerId: string, query: PetsQuery = {}) {
    const currentPage = query.current_page ?? 1;
    const perPage = query.per_page ?? 10;

    // Build WHERE conditions for both pets and pet_extra_informations
    const conditions = this.mapPetsQuery(query);
    const where = and(
      eq(pets.customer_id, customerId),
      eq(pets.pet_status, PetStatusEnum.Enum.has_owner),
      conditions.length > 0 ? and(...conditions) : undefined,
    );

    const _pets = await this.db.query.pets.findMany({
      where,
      with: {
        pet_extra_information: true,
      },
      orderBy: (query.sorting_order === "ascending" ? asc : desc)(
        this.mapPetsSortingField(query.sorting_field),
      ),
      // When provided as 0, it returns all rows without pagination
      offset: currentPage === 0 ? undefined : (currentPage - 1) * perPage,
      limit: perPage === 0 ? undefined : perPage,
    });

    // Count total with same WHERE conditions
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

  async getAdoptablePetsList(query: PetsQuery = {}) {
    const currentPage = query.current_page ?? 1;
    const perPage = query.per_page ?? 10;

    // Build WHERE conditions for both pets and pet_extra_informations
    const conditions = this.mapPetsQuery(query);
    const where = and(
      eq(pets.pet_status, PetStatusEnum.Enum.adopting),
      conditions.length > 0 ? and(...conditions) : undefined,
    );

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

    // Count total with same WHERE conditions
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
      name,
      sizes,
      species,
      birth_date_from,
      birth_date_to,
      energy_levels,
      friendliness_with_children_levels,
      friendliness_with_pets_levels,
      is_house_trained,
      training_levels,
    } = query;

    // Partial name search (case-insensitive)
    if (name) {
      conditions.push(ilike(pets.name, `%${name}%`));
    }

    // Species array
    if (species && species.length > 0) {
      conditions.push(inArray(pets.species, species));
    }

    // Size array
    if (sizes && sizes.length > 0) {
      const sizeCondition = and(
        isNotNull(pets.size),
        inArray(pets.size, sizes as any),
      );
      if (sizeCondition) conditions.push(sizeCondition);
    }

    // Birth date range (for age filtering)
    if (birth_date_from) {
      conditions.push(gte(pets.birth_date, birth_date_from));
    }
    if (birth_date_to) {
      conditions.push(lte(pets.birth_date, birth_date_to));
    }

    // Energy level filter
    if (energy_levels && energy_levels.length > 0) {
      const energyCondition = and(
        isNotNull(pet_extra_informations.energy_level),
        inArray(pet_extra_informations.energy_level, energy_levels as any),
      );
      if (energyCondition) conditions.push(energyCondition);
    }

    // Friendliness with children filter
    if (
      friendliness_with_children_levels &&
      friendliness_with_children_levels.length > 0
    ) {
      const friendlinessChildrenCondition = and(
        isNotNull(pet_extra_informations.friendliness_with_children),
        inArray(
          pet_extra_informations.friendliness_with_children,
          friendliness_with_children_levels as any,
        ),
      );
      if (friendlinessChildrenCondition)
        conditions.push(friendlinessChildrenCondition);
    }

    // Friendliness with pets filter
    if (
      friendliness_with_pets_levels &&
      friendliness_with_pets_levels.length > 0
    ) {
      const friendlinessPetsCondition = and(
        isNotNull(pet_extra_informations.friendliness_with_pets),
        inArray(
          pet_extra_informations.friendliness_with_pets,
          friendliness_with_pets_levels as any,
        ),
      );
      if (friendlinessPetsCondition) conditions.push(friendlinessPetsCondition);
    }

    // House trained filter
    if (is_house_trained !== undefined) {
      conditions.push(
        eq(pet_extra_informations.is_house_trained, is_house_trained),
      );
    }

    // Training level filter
    if (training_levels && training_levels.length > 0) {
      const trainingCondition = and(
        isNotNull(pet_extra_informations.training_level),
        inArray(pet_extra_informations.training_level, training_levels as any),
      );
      if (trainingCondition) conditions.push(trainingCondition);
    }

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

  private buildOrderBy(query: PetsQuery = {}) {
    const sortingField = query.sorting_field ?? "created_at";
    const sortingOrder = query.sorting_order ?? "descending";

    const column = sortingField === "name" ? pets.name : pets.created_at;

    return sortingOrder === "ascending" ? asc(column) : desc(column);
  }

  async getAdoptablePet(id: number) {
    const pet = await this.db.query.pets.findFirst({
      where: and(
        eq(pets.id, id),
        eq(pets.pet_status, PetStatusEnum.Enum.adopting),
      ),
      with: {
        pet_extra_information: true,
        customer: true,
      },
    });

    if (!pet) return null;

    return {
      ...pet,
      owner_phone: pet.customer?.phone ?? null,
    };
  }

  async getOwnPet(customerId: string, id: number) {
    const pet = await this.db.query.pets.findFirst({
      where: and(eq(pets.id, id), eq(pets.customer_id, customerId)),
      with: {
        pet_extra_information: true,
      },
    });

    return pet;
  }

  async updatePet(id: number, data: Partial<any>) {
    await this.db
      .update(pets)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(pets.id, id));

    // Fetch the updated pet with pet_extra_information
    const updatedPet = await this.db.query.pets.findFirst({
      where: eq(pets.id, id),
      with: {
        pet_extra_information: true,
      },
    });

    return updatedPet;
  }

  async deletePet(id: number) {
    await this.db.delete(pets).where(eq(pets.id, id));
  }
}
