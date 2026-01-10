import { Injectable, NotFoundException } from "@nestjs/common";
import { AdoptionPostsQuery } from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";

import { AdoptionPostsRepository } from "./adoption_posts.repository";

@Injectable()
export class AdoptionPostsService {
  constructor(
    private readonly cls: ClsService,
    private readonly adoptionPostsRepository: AdoptionPostsRepository,
  ) {}

  private sortPetImages(images: any[]) {
    return images
      ? [...images].sort((a, b) => {
          // Primary images first
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          // Then by display_order
          return a.display_order - b.display_order;
        })
      : [];
  }

  async getAdoptionPostsList(query: AdoptionPostsQuery = {}) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    const posts =
      await this.adoptionPostsRepository.getAdoptionPostsList(query);

    if (!accountProfile) {
      return {
        data: posts.data.map((post) => ({
          ...post,
          pet: {
            ...post.pet,
            images: this.sortPetImages(post.pet.images),
          },
        })),
        meta: posts.meta,
      };
    }

    const postIds = posts.data.map((p) => p.id);
    const favoriteSet =
      await this.adoptionPostsRepository.getFavoriteStatusBatch(
        accountProfile.id,
        postIds,
      );

    return {
      data: posts.data.map((post) => ({
        ...post,
        pet: {
          ...post.pet,
          images: this.sortPetImages(post.pet.images),
        },
        is_favorite: favoriteSet.has(post.id),
      })),
      meta: posts.meta,
    };
  }

  async getAdoptionPost(id: number) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);
    let isFavorite = false;
    const post = await this.adoptionPostsRepository.getAdoptionPost(id);

    if (accountProfile) {
      isFavorite = await this.adoptionPostsRepository.isFavoriteAdoptionPost(
        accountProfile.id,
        id,
      );
    }

    if (!post) {
      throw new NotFoundException(`Adoption post with ID ${id} not found`);
    }

    return {
      ...post,
      pet: {
        ...post.pet,
        images: this.sortPetImages(post.pet.images),
      },
      is_favorite: isFavorite,
    };
  }

  async addFavoriteAdoptionPost(id: number) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    await this.adoptionPostsRepository.addFavoriteAdoptionPost(
      accountProfile.id,
      id,
    );
  }

  async getFavoriteAdoptionPostsList(query: AdoptionPostsQuery = {}) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    const response =
      await this.adoptionPostsRepository.getFavoriteAdoptionPostsList(
        accountProfile.id,
        query,
      );
    if (!response) {
      throw new NotFoundException();
    }

    return response;
  }

  async removeFavoriteAdoptionPost(id: number) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    const post = await this.getAdoptionPost(id);

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    await this.adoptionPostsRepository.removeFavoriteAdoptionPost(
      accountProfile.id,
      id,
    );
  }
}
