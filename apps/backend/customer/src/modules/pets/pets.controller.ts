import { Controller, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import {
  customerContract,
  OwnPetResponseBody,
  PetsListResponseBody,
} from "customer_api";
import { FilesFastifyInterceptor } from "fastify-file-interceptor";

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

  @TsRestHandler(customerContract.pets.createPetMedicalRecord)
  async createPetMedicalRecord() {
    return tsRestHandler(
      customerContract.pets.createPetMedicalRecord,
      async ({ params, body }) => {
        await this.petsService.createPetMedicalRecord(params.id, body);

        return {
          body: {},
          status: 201,
        };
      },
    );
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
        console.log(pet, "pet plesae");
        const parsedData = OwnPetResponseBody.parse(pet);

        return {
          status: 200,
          body: parsedData,
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

  @Public()
  @TsRestHandler(customerContract.pets.uploadPetImages)
  @UseInterceptors(FilesFastifyInterceptor("files", 18, {}))
  async uploadPetImages(@UploadedFiles() files: Express.Multer.File[]) {
    return tsRestHandler(customerContract.pets.uploadPetImages, async () => {
      const uploadedFilesPaths = await this.petsService.uploadPetImages(files);

      return {
        status: 201,
        body: uploadedFilesPaths,
      };
    });
  }
}
