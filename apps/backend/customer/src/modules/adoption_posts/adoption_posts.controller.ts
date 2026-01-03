import { Controller } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import {
  AdoptionPostResponseBody,
  AdoptionPostsListResponseBody,
  customerContract,
} from "customer_api";

import { Public } from "@/common/decorators/public";

import { AdoptionPostsService } from "./adoption_posts.service";

@Controller()
export class AdoptionPostsController {
  constructor(private readonly adoptionPostsService: AdoptionPostsService) {}

  @Public()
  @TsRestHandler(customerContract.adoptionPosts.getAdoptionPostsList)
  async getAdoptionPostsList() {
    return tsRestHandler(
      customerContract.adoptionPosts.getAdoptionPostsList,
      async ({ query }) => {
        const result =
          await this.adoptionPostsService.getAdoptionPostsList(query);

        const parsedData = AdoptionPostsListResponseBody.parse(result.data);

        return {
          status: 200,
          body: {
            data: parsedData,
            meta: result.meta,
          },
        };
      },
    );
  }

  @Public()
  @TsRestHandler(customerContract.adoptionPosts.getAdoptionPost)
  async getAdoptionPost() {
    return tsRestHandler(
      customerContract.adoptionPosts.getAdoptionPost,
      async ({ params }) => {
        const post = await this.adoptionPostsService.getAdoptionPost(params.id);

        const parsedData = AdoptionPostResponseBody.parse(post);

        return {
          status: 200,
          body: parsedData,
        };
      },
    );
  }

  @TsRestHandler(customerContract.adoptionPosts.addFavoriteAdoptionPost)
  async addFavoriteAdoptionPost() {
    return tsRestHandler(
      customerContract.adoptionPosts.addFavoriteAdoptionPost,
      async ({ params }) => {
        await this.adoptionPostsService.addFavoriteAdoptionPost(params.id);

        return {
          body: {},
          status: 201,
        };
      },
    );
  }

  @TsRestHandler(customerContract.adoptionPosts.getFavoriteAdoptionPostsList)
  async getFavoriteAdoptionPostsList() {
    return tsRestHandler(
      customerContract.adoptionPosts.getFavoriteAdoptionPostsList,
      async ({ query }) => {
        const result =
          await this.adoptionPostsService.getFavoriteAdoptionPostsList(query);

        const parsedData = AdoptionPostsListResponseBody.parse(result.data);

        return {
          status: 200,
          body: {
            data: parsedData,
            meta: result.meta,
          },
        };
      },
    );
  }

  @TsRestHandler(customerContract.adoptionPosts.removeFavoriteAdoptionPost)
  async removeFavoriteAdoptionPost() {
    return tsRestHandler(
      customerContract.adoptionPosts.removeFavoriteAdoptionPost,
      async ({ params }) => {
        await this.adoptionPostsService.removeFavoriteAdoptionPost(params.id);

        return {
          status: 204,
          body: {},
        };
      },
    );
  }
}
