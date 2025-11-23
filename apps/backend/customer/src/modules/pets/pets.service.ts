import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePetRequestBody } from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";

import { PetsRepository } from "./pets.repository";

// interface ListPetsFilters {
//   customer_id?: string;
//   species?: string;
//   pet_status?: string;
//   limit?: number;
//   offset?: number;
// }

@Injectable()
export class PetsService {
  constructor(
    private readonly cls: ClsService,
    private readonly petsRepository: PetsRepository,
  ) {}

  async createPet(data: CreatePetRequestBody) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);
    console.log(accountProfile, "accountProfileaccountProfile");

    // const petExtraInformationId =
    //   await this.petsRepository.createPetExtraInformation(
    //     data.pet_extra_information,
    //   );

    // await this.petsRepository.createPet(
    //   accountProfile.id,
    //   petExtraInformationId,
    //   data,
    // );
    const testId = "13c26c66-7e84-411b-8be1-0823e1787674";
    await this.petsRepository.createPetAndPetExtraInformations(
      // accountProfile.id,
      testId,
      data,
    );
  }

  // async listPets(filters: ListPetsFilters) {
  //   return await this.petsRepository.listPets(filters);
  // }

  // async getPetById(id: string) {
  //   const pet = await this.petsRepository.getPetById(id);
  //   if (!pet) {
  //     throw new NotFoundException(`Pet with ID ${id} not found`);
  //   }
  //   return pet;
  // }

  // async updatePet(id: string, data: UpdatePetRequestBody) {
  //   // First check if pet exists
  //   await this.getPetById(id);

  //   const updatedPet = await this.petsRepository.updatePet(id, data);
  //   if (!updatedPet) {
  //     throw new NotFoundException(`Pet with ID ${id} not found`);
  //   }
  //   return updatedPet;
  // }

  // async deletePet(id: string) { //   // First check if pet exists //   await this.getPetById(id);

  //   const deletedPet = await this.petsRepository.deletePet(id);
  //   if (!deletedPet) {
  //     throw new NotFoundException(`Pet with ID ${id} not found`);
  //   }
  //   return deletedPet;
  // }
}
