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

  @Public()
  @TsRestHandler(customerContract.pets.getPetsList)
  async getPetsList() {
    return tsRestHandler(
      customerContract.pets.getPetsList,
      async ({ query }) => {
        const result = await this.petsService.getPetsList(query);

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
}
