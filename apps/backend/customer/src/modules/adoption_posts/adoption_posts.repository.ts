import { Inject, Injectable } from "@nestjs/common";
import { AdoptionPostsQuery } from "customer_api";
import {
  adoption_posts,
  pet_extra_informations,
  pets,
} from "database";
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
export class AdoptionPostsRepository {
  constructor(@Inject("DATABASE") private readonly db: Database) {}

  async getAdoptionPostsList(query: AdoptionPostsQuery = {}) {
    const currentPage = query?.current_page ?? 1;
    const perPage = query?.per_page ?? 10;

    const conditions = this.mapAdoptionPostsQuery(query);
    const where = and(
      eq(adoption_posts.post_status, "active"),
      conditions.length > 0 ? and(...conditions) : undefined,
    );

    const posts = await this.db.query.adoption_posts.findMany({
      where,
      with: {
        pet: {
          with: {
            pet_extra_information: true,
          },
        },
      },
      orderBy: (query?.sorting_order === "ascending" ? asc : desc)(
        this.mapSortingField(query?.sorting_field),
      ),
      offset: currentPage === 0 ? undefined : (currentPage - 1) * perPage,
      limit: perPage === 0 ? undefined : perPage,
    });

    const _count = await this.db
      .select({ total: count() })
      .from(adoption_posts)
      .innerJoin(pets, eq(adoption_posts.pet_id, pets.id))
      .leftJoin(
        pet_extra_informations,
        eq(pets.pet_extra_information_id, pet_extra_informations.id),
      )
      .where(where);

    const total = _count.find(Boolean)?.total ?? 0;

    return {
      data: posts,
      meta: {
        total,
        per_page: perPage,
        current_page: currentPage,
      },
    };
  }

  async getAdoptionPost(id: number) {
    const post = await this.db.query.adoption_posts.findFirst({
      where: and(
        eq(adoption_posts.id, id),
        eq(adoption_posts.post_status, "active"),
      ),
      with: {
        pet: {
          with: {
            pet_extra_information: true,

          },
        },
      },
    });

    return post;
  }

  private mapAdoptionPostsQuery(query: AdoptionPostsQuery = {}) {
    const conditions: SQL<unknown | undefined>[] = [];

    if (!query) return conditions;

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
      price_min,
      price_max,
    } = query;

    // Partial name search (case-insensitive) on pet name
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

    // Birth date range
    if (birth_date_from) {
      conditions.push(gte(pets.birth_date, birth_date_from));
    }
    if (birth_date_to) {
      conditions.push(lte(pets.birth_date, birth_date_to));
    }

    // Price range
    if (price_min !== undefined) {
      conditions.push(gte(adoption_posts.price, price_min));
    }
    if (price_max !== undefined) {
      conditions.push(lte(adoption_posts.price, price_max));
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

  private mapSortingField(
    field: NonNullable<AdoptionPostsQuery>["sorting_field"],
  ) {
    switch (field) {
      case "name":
        return pets.name;
      case "price":
        return adoption_posts.price;
      case "created_at":
      default:
        return adoption_posts.created_at;
    }
  }
}
