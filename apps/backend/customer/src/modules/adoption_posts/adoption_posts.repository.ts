import { Inject, Injectable } from "@nestjs/common";
import {
  AdoptionPostsQuery,
  CreateAdoptionPostRequestBody,
  OwnAdoptionPostsQuery,
  UpdateAdoptionPostRequestBody,
} from "customer_api";
import {
  adoption_posts,
  favorites,
  pet_extra_informations,
  pets,
} from "database";
import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
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

  async addFavoriteAdoptionPost(customerId: string, adoptionPostId: number) {
    await this.db.insert(favorites).values({
      customer_id: customerId,
      adoption_post_id: adoptionPostId,
    });
  }

  async removeFavoriteAdoptionPost(customerId: string, adoptionPostId: number) {
    await this.db
      .delete(favorites)
      .where(
        and(
          eq(favorites.customer_id, customerId),
          eq(favorites.adoption_post_id, adoptionPostId),
        ),
      );
  }

  async getFavoriteAdoptionPostsList(
    customerId: string,
    query: AdoptionPostsQuery = {},
  ) {
    const condition = and(
      exists(
        this.db
          .select()
          .from(favorites)
          .where(
            and(
              eq(favorites.adoption_post_id, adoption_posts.id),
              eq(favorites.customer_id, customerId),
            ),
          ),
      ),
    );
    if (!condition) return null;

    return await this.getAdoptionPostsListByCondition(query, condition);
  }

  async getAdoptionPostsList(query: AdoptionPostsQuery = {}) {
    const condition = eq(adoption_posts.post_status, "active");

    return await this.getAdoptionPostsListByCondition(query, condition);
  }

  async getFavoriteAdoptionPostsTotal(customerId: string) {
    const _count = await this.db
      .select({ total: count() })
      .from(favorites)
      .where(eq(favorites.customer_id, customerId));

    const favCount = _count.find(Boolean);
    const total = favCount ? favCount.total : 0;

    return total;
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
            images: true,
          },
        },
      },
    });

    return post;
  }

  async isFavoriteAdoptionPost(customerId: string, postId: number) {
    const favorite = await this.db.query.favorites.findFirst({
      where: and(
        eq(favorites.customer_id, customerId),
        eq(favorites.adoption_post_id, postId),
      ),
    });

    return !!favorite;
  }

  async getFavoriteStatusBatch(
    customerId: string,
    postIds: number[],
  ): Promise<Set<number>> {
    if (postIds.length === 0) {
      return new Set();
    }

    const results = await this.db
      .select({ adoption_post_id: favorites.adoption_post_id })
      .from(favorites)
      .where(
        and(
          eq(favorites.customer_id, customerId),
          inArray(favorites.adoption_post_id, postIds),
        ),
      );

    return new Set(results.map((r) => r.adoption_post_id));
  }

  private async getAdoptionPostsListByCondition(
    query: AdoptionPostsQuery = {},
    condition: SQL<unknown>,
  ) {
    const currentPage = query.current_page ?? 1;
    const perPage = query.per_page ?? 10;

    // Build WHERE conditions for both pets and pet_extra_informations
    const conditions = this.mapAdoptionPostsQuery(query);
    const where = and(
      condition,
      eq(adoption_posts.post_status, "active"),
      conditions.length > 0 ? and(...conditions) : undefined,
    );

    const posts = await this.db.query.adoption_posts.findMany({
      where,
      with: {
        pet: {
          with: {
            pet_extra_information: true,
            images: true,
          },
        },
      },
      orderBy: (query.sorting_order === "ascending" ? asc : desc)(
        this.mapSortingField(query.sorting_field),
      ),
      // When provided as 0, it returns all rows without pagination
      offset: currentPage === 0 ? undefined : (currentPage - 1) * perPage,
      limit: perPage === 0 ? undefined : perPage,
    });

    // Count total with same WHERE conditions
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

  // ============================================================
  // Own Adoption Posts CRUD Methods
  // ============================================================

  async createAdoptionPost(
    ownerId: string,
    data: CreateAdoptionPostRequestBody,
  ) {
    const { pet_id, price, address, contact, notes } = data;

    const [createdPost] = await this.db
      .insert(adoption_posts)
      .values({
        pet_id,
        owner: ownerId,
        price,
        address,
        contact,
        notes,
        post_status: "active",
      })
      .returning();

    // Fetch the created post with pet details
    return this.getOwnAdoptionPost(ownerId, createdPost!.id);
  }

  async hasActiveAdoptionPost(petId: number): Promise<boolean> {
    const existingPost = await this.db.query.adoption_posts.findFirst({
      where: and(
        eq(adoption_posts.pet_id, petId),
        eq(adoption_posts.post_status, "active"),
      ),
    });

    return !!existingPost;
  }

  async getOwnAdoptionPostsList(
    ownerId: string,
    query: OwnAdoptionPostsQuery = {},
  ) {
    const currentPage = query?.current_page ?? 1;
    const perPage = query?.per_page ?? 10;

    const conditions: SQL<unknown | undefined>[] = [
      eq(adoption_posts.owner, ownerId),
    ];

    // Filter by post_status if provided
    if (query?.post_status && query.post_status.length > 0) {
      conditions.push(inArray(adoption_posts.post_status, query.post_status));
    }

    const where = and(...conditions);

    const posts = await this.db.query.adoption_posts.findMany({
      where,
      with: {
        pet: {
          with: {
            pet_extra_information: true,
            images: true,
          },
        },
      },
      orderBy: (query?.sorting_order === "ascending" ? asc : desc)(
        this.mapOwnPostsSortingField(query?.sorting_field),
      ),
      offset: currentPage === 0 ? undefined : (currentPage - 1) * perPage,
      limit: perPage === 0 ? undefined : perPage,
    });

    // Count total
    const _count = await this.db
      .select({ total: count() })
      .from(adoption_posts)
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

  async getOwnAdoptionPost(ownerId: string, postId: number) {
    const post = await this.db.query.adoption_posts.findFirst({
      where: and(
        eq(adoption_posts.id, postId),
        eq(adoption_posts.owner, ownerId),
      ),
      with: {
        pet: {
          with: {
            pet_extra_information: true,
            images: true,
          },
        },
      },
    });

    return post;
  }

  async updateAdoptionPost(
    postId: number,
    data: UpdateAdoptionPostRequestBody,
  ) {
    const { price, address, contact, notes, post_status } = data;

    await this.db
      .update(adoption_posts)
      .set({
        price,
        address,
        contact,
        notes,
        post_status,
        updated_at: new Date(),
      })
      .where(eq(adoption_posts.id, postId));

    // Fetch the updated post
    const updatedPost = await this.db.query.adoption_posts.findFirst({
      where: eq(adoption_posts.id, postId),
      with: {
        pet: {
          with: {
            pet_extra_information: true,
            images: true,
          },
        },
      },
    });

    return updatedPost;
  }

  async deleteAdoptionPost(postId: number) {
    await this.db.delete(adoption_posts).where(eq(adoption_posts.id, postId));
  }

  async isPostOwner(ownerId: string, postId: number): Promise<boolean> {
    const post = await this.db.query.adoption_posts.findFirst({
      where: and(
        eq(adoption_posts.id, postId),
        eq(adoption_posts.owner, ownerId),
      ),
    });

    return !!post;
  }

  async getAdoptionPostById(postId: number) {
    return await this.db.query.adoption_posts.findFirst({
      where: eq(adoption_posts.id, postId),
    });
  }

  private mapOwnPostsSortingField(
    field: NonNullable<OwnAdoptionPostsQuery>["sorting_field"],
  ) {
    switch (field) {
      case "price":
        return adoption_posts.price;
      case "created_at":
      default:
        return adoption_posts.created_at;
    }
  }
}
