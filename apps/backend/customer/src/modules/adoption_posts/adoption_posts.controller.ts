import { Controller, UseGuards } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import {
  AdoptionPostResponseBody,
  AdoptionPostsListResponseBody,
  customerContract,
  OwnAdoptionPostResponseBody,
  OwnAdoptionPostsListResponseBody,
} from "customer_api";

import { Public } from "@/common/decorators/public";
import { OptionalGuard } from "@/common/guards/optional.guard";

import { AdoptionPostsService } from "./adoption_posts.service";

@Controller()
export class AdoptionPostsController {
  constructor(private readonly adoptionPostsService: AdoptionPostsService) {}

  @Public()
  @UseGuards(OptionalGuard)
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
  @UseGuards(OptionalGuard)
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


  @TsRestHandler(customerContract.adoptionPosts.createAdoptionPost)
  async createAdoptionPost() {
    return tsRestHandler(
      customerContract.adoptionPosts.createAdoptionPost,
      async ({ body }) => {
        const post = await this.adoptionPostsService.createAdoptionPost(body);

        const parsedData = OwnAdoptionPostResponseBody.parse(post);

        return {
          status: 201,
          body: parsedData,
        };
      },
    );
  }

  @TsRestHandler(customerContract.adoptionPosts.getOwnAdoptionPostsList)
  async getOwnAdoptionPostsList() {
    return tsRestHandler(
      customerContract.adoptionPosts.getOwnAdoptionPostsList,
      async ({ query }) => {
        const result =
          await this.adoptionPostsService.getOwnAdoptionPostsList(query);

        const parsedData = OwnAdoptionPostsListResponseBody.parse(result.data);

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

  @TsRestHandler(customerContract.adoptionPosts.getOwnAdoptionPost)
  async getOwnAdoptionPost() {
    return tsRestHandler(
      customerContract.adoptionPosts.getOwnAdoptionPost,
      async ({ params }) => {
        const post = await this.adoptionPostsService.getOwnAdoptionPost(
          params.id,
        );

        const parsedData = OwnAdoptionPostResponseBody.parse(post);

        return {
          status: 200,
          body: parsedData,
        };
      },
    );
  }

  @TsRestHandler(customerContract.adoptionPosts.updateAdoptionPost)
  async updateAdoptionPost() {
    return tsRestHandler(
      customerContract.adoptionPosts.updateAdoptionPost,
      async ({ params, body }) => {
        const post = await this.adoptionPostsService.updateAdoptionPost(
          params.id,
          body,
        );

        const parsedData = OwnAdoptionPostResponseBody.parse(post);

        return {
          status: 200,
          body: parsedData,
        };
      },
    );
  }

  @TsRestHandler(customerContract.adoptionPosts.deleteAdoptionPost)
  async deleteAdoptionPost() {
    return tsRestHandler(
      customerContract.adoptionPosts.deleteAdoptionPost,
      async ({ params }) => {
        await this.adoptionPostsService.deleteAdoptionPost(params.id);

        return {
          status: 204,
          body: {},
        };
      },
    );
  }
}
