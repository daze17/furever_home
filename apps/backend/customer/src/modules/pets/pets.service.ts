import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreatePetRequestBody, PetsQuery } from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";

import { PetsRepository } from "./pets.repository";

@Injectable()
export class PetsService {
  constructor(
    private readonly cls: ClsService,
    private readonly petsRepository: PetsRepository,
  ) {}

  async createPet(data: CreatePetRequestBody) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    await this.petsRepository.createPetAndPetExtraInformations(
      accountProfile.id,
      data,
    );
  }

  async getPetsList(query: PetsQuery = {}) {
    const response = await this.petsRepository.getPetsList(query);

    return response;
  }

  async getPet(id: number) {
    const pet = await this.petsRepository.getPet(id);

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return pet;
  }

  async updatePet(id: number, data: any) {
    // Get current user
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    // Check if pet exists
    const pet = await this.getPet(id);

    // Verify ownership
    if (pet.customer_id !== accountProfile.id) {
      throw new ForbiddenException(
        "You do not have permission to update this pet",
      );
    }

    // Update pet
    const updatedPet = await this.petsRepository.updatePet(id, data);

    if (!updatedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return updatedPet;
  }

  async deletePet(id: number) {
    // Get current user
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    // Check if pet exists
    const pet = await this.getPet(id);

    // Verify ownership
    if (pet.customer_id !== accountProfile.id) {
      throw new ForbiddenException(
        "You do not have permission to delete this pet",
      );
    }

    // Delete pet
    await this.petsRepository.deletePet(id);
  }
}
