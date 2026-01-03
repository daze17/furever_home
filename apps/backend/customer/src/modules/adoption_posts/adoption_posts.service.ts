import { Injectable, NotFoundException } from "@nestjs/common";
import { AdoptionPostsQuery } from "customer_api";

import { AdoptionPostsRepository } from "./adoption_posts.repository";

@Injectable()
export class AdoptionPostsService {
  constructor(
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
}
