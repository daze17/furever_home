import { Controller } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { customerContract } from "customer_api";

import { PetsService } from "./pets.service";

@Controller()
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @TsRestHandler(customerContract.pets.createPet)
  async createPet() {
    return tsRestHandler(customerContract.pets.createPet, async ({ body }) => {
      const pet = await this.petsService.createPet(body);
      return {
        status: 201,
        body: pet,
      };
    });
  }

  @TsRestHandler(customerContract.pets.listPets)
  async listPets() {
    return tsRestHandler(customerContract.pets.listPets, async ({ query }) => {
      const result = await this.petsService.listPets({
        customer_id: query.customer_id,
        species: query.species,
        pet_status: query.pet_status,
        limit: query.limit,
        offset: query.offset,
      });
      return {
        status: 200,
        body: result,
      };
    });
  }

  @TsRestHandler(customerContract.pets.getPet)
  async getPet() {
    return tsRestHandler(
      customerContract.pets.getPet,
      async ({ params: { id } }) => {
        const pet = await this.petsService.getPetById(id);
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
      async ({ params: { id }, body }) => {
        const pet = await this.petsService.updatePet(id, body);
        return {
          status: 200,
          body: pet,
        };
      },
    );
  }

  @TsRestHandler(customerContract.pets.deletePet)
  async deletePet() {
    return tsRestHandler(
      customerContract.pets.deletePet,
      async ({ params: { id } }) => {
        await this.petsService.deletePet(id);
        return {
          status: 204,
          body: {},
        };
      },
    );
  }
}
