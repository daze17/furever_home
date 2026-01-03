import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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

  async getOwnPetsList(query: PetsQuery = {}) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);
    const response = await this.petsRepository.getOwnPetsList(
      accountProfile.id,
      query,
    );

    return response;
  }

  async getAdoptablePetsList(query: PetsQuery = {}) {
    const response = await this.petsRepository.getAdoptablePetsList(query);

    return response;
  }

  async getAdoptablePet(id: number) {
    const pet = await this.petsRepository.getAdoptablePet(id);

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return pet;
  }

  async getOwnPet(id: number) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);
    const pet = await this.petsRepository.getOwnPet(accountProfile.id, id);

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return pet;
  }

  async updatePet(id: number, data: any) {
    // Get current user
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    // Check if pet exists
    const pet = await this.getAdoptablePet(id);

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
    const pet = await this.getAdoptablePet(id);

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
