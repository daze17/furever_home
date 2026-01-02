import { Controller } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { customerContract, PetsListResponseBody } from "customer_api";

import { Public } from "@/common/decorators/public";

import { PetsService } from "./pets.service";

@Controller()
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @TsRestHandler(customerContract.pets.createPet)
  async createPet() {
    return tsRestHandler(customerContract.pets.createPet, async ({ body }) => {
      await this.petsService.createPet(body);

      return {
        body: {},
        status: 201,
      };
    });
  }

  @TsRestHandler(customerContract.pets.getOwnPetsList)
  async getOwnPetsList() {
    return tsRestHandler(
      customerContract.pets.getOwnPetsList,
      async ({ query }) => {
        const result = await this.petsService.getOwnPetsList(query);

        const parsedData = PetsListResponseBody.parse(result.data);

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

  @TsRestHandler(customerContract.pets.getFavoritePetsList)
  async getFavoritePetsList() {
    return tsRestHandler(
      customerContract.pets.getFavoritePetsList,
      async ({ query }) => {
        const result = await this.petsService.getFavoritePetsList(query);

        const parsedData = PetsListResponseBody.parse(result.data);

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
  @TsRestHandler(customerContract.pets.getAdoptablePetsList)
  async getAdoptablePetsList() {
    return tsRestHandler(
      customerContract.pets.getAdoptablePetsList,
      async ({ query }) => {
        const result = await this.petsService.getAdoptablePetsList(query);

        const parsedData = PetsListResponseBody.parse(result.data);

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
  @TsRestHandler(customerContract.pets.getAdoptablePet)
  async getAdoptablePet() {
    return tsRestHandler(
      customerContract.pets.getAdoptablePet,
      async ({ params }) => {
        const pet = await this.petsService.getAdoptablePet(params.id);

        return {
          status: 200,
          body: pet,
        };
      },
    );
  }

  @TsRestHandler(customerContract.pets.getOwnPet)
  async getOwnPet() {
    return tsRestHandler(
      customerContract.pets.getOwnPet,
      async ({ params }) => {
        const pet = await this.petsService.getOwnPet(params.id);

        return {
          status: 200,
          body: pet,
        };
      },
    );
  }

  @TsRestHandler(customerContract.pets.updatePet)
  async updatePet() {
    return tsRestHandler(
      customerContract.pets.updatePet,
      async ({ params, body }) => {
        const updatedPet = await this.petsService.updatePet(params.id, body);

        return {
          status: 200,
          body: updatedPet,
        };
      },
    );
  }

  @TsRestHandler(customerContract.pets.deletePet)
  async deletePet() {
    return tsRestHandler(
      customerContract.pets.deletePet,
      async ({ params }) => {
        await this.petsService.deletePet(params.id);

        return {
          status: 204,
          body: {},
        };
      },
    );
  }
}
