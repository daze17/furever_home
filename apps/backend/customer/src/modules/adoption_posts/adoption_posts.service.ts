import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
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

  async getAdoptionPostsList(query: AdoptionPostsQuery = {}) {
    const response =
      await this.adoptionPostsRepository.getAdoptionPostsList(query);

    return response;
  }

  async getAdoptionPost(id: number) {
    const post = await this.adoptionPostsRepository.getAdoptionPost(id);

    if (!post) {
      throw new NotFoundException(`Adoption post with ID ${id} not found`);
    }

    return post;
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
