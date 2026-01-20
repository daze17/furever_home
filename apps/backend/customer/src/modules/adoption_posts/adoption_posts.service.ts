import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  AdoptionPostsQuery,
  CreateAdoptionPostRequestBody,
  OwnAdoptionPostsQuery,
  UpdateAdoptionPostRequestBody,
} from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";
import { PetsRepository } from "@/modules/pets/pets.repository";

import { AdoptionPostsRepository } from "./adoption_posts.repository";

@Injectable()
export class AdoptionPostsService {
  constructor(
    private readonly cls: ClsService,
    private readonly adoptionPostsRepository: AdoptionPostsRepository,
    private readonly petsRepository: PetsRepository,
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

  // ============================================================
  // Own Adoption Posts CRUD Methods
  // ============================================================

  async createAdoptionPost(data: CreateAdoptionPostRequestBody) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    // Verify pet ownership
    const pet = await this.petsRepository.getOwnPet(
      accountProfile.id,
      data.pet_id,
    );
    if (!pet) {
      throw new NotFoundException(
        `Pet with ID ${data.pet_id} not found or you do not own this pet`,
      );
    }

    // Check if pet already has an active adoption post
    const hasActivePost =
      await this.adoptionPostsRepository.hasActiveAdoptionPost(data.pet_id);
    if (hasActivePost) {
      throw new ConflictException(
        "This pet already has an active adoption post",
      );
    }

    // Create adoption post
    const post = await this.adoptionPostsRepository.createAdoptionPost(
      accountProfile.id,
      data,
    );

    // Update pet status to 'adopting'
    await this.petsRepository.updatePet(data.pet_id, { pet_status: "adopting" });

    return {
      ...post,
      pet: {
        ...post!.pet,
        images: this.sortPetImages(post!.pet.images),
      },
    };
  }

  async getOwnAdoptionPostsList(query: OwnAdoptionPostsQuery = {}) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    const response =
      await this.adoptionPostsRepository.getOwnAdoptionPostsList(
        accountProfile.id,
        query,
      );

    return {
      data: response.data.map((post) => ({
        ...post,
        pet: {
          ...post.pet,
          images: this.sortPetImages(post.pet.images),
        },
      })),
      meta: response.meta,
    };
  }

  async getOwnAdoptionPost(id: number) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    const post = await this.adoptionPostsRepository.getOwnAdoptionPost(
      accountProfile.id,
      id,
    );

    if (!post) {
      throw new NotFoundException(`Adoption post with ID ${id} not found`);
    }

    return {
      ...post,
      pet: {
        ...post.pet,
        images: this.sortPetImages(post.pet.images),
      },
    };
  }

  async updateAdoptionPost(id: number, data: UpdateAdoptionPostRequestBody) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    // Verify post ownership
    const isOwner = await this.adoptionPostsRepository.isPostOwner(
      accountProfile.id,
      id,
    );
    if (!isOwner) {
      throw new ForbiddenException(
        "You do not have permission to update this post",
      );
    }

    const updatedPost = await this.adoptionPostsRepository.updateAdoptionPost(
      id,
      data,
    );

    if (!updatedPost) {
      throw new NotFoundException(`Adoption post with ID ${id} not found`);
    }

    return {
      ...updatedPost,
      pet: {
        ...updatedPost.pet,
        images: this.sortPetImages(updatedPost.pet.images),
      },
    };
  }

  async deleteAdoptionPost(id: number) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    // Verify post ownership
    const isOwner = await this.adoptionPostsRepository.isPostOwner(
      accountProfile.id,
      id,
    );
    if (!isOwner) {
      throw new ForbiddenException(
        "You do not have permission to delete this post",
      );
    }

    // Get the post to retrieve pet_id before deletion
    const post = await this.adoptionPostsRepository.getAdoptionPostById(id);
    if (!post) {
      throw new NotFoundException(`Adoption post with ID ${id} not found`);
    }

    // Delete the adoption post
    await this.adoptionPostsRepository.deleteAdoptionPost(id);

    // Update pet status back to 'has_owner'
    await this.petsRepository.updatePet(post.pet_id, {
      pet_status: "has_owner",
    });
  }
}
