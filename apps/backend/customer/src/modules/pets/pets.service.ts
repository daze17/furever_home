import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePetRequestBody, UpdatePetRequestBody } from "customer_api";

import { PetsRepository } from "./pets.repository";

interface ListPetsFilters {
  customer_id?: string;
  species?: string;
  pet_status?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class PetsService {
  constructor(private readonly petsRepository: PetsRepository) {}

  async createPet(data: CreatePetRequestBody) {
    return await this.petsRepository.createPet(data);
  }

  async listPets(filters: ListPetsFilters) {
    return await this.petsRepository.listPets(filters);
  }

  async getPetById(id: string) {
    const pet = await this.petsRepository.getPetById(id);
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
  }

  async updatePet(id: string, data: UpdatePetRequestBody) {
    // First check if pet exists
    await this.getPetById(id);

    const updatedPet = await this.petsRepository.updatePet(id, data);
    if (!updatedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return updatedPet;
  }

  async deletePet(id: string) {
    // First check if pet exists
    await this.getPetById(id);

    const deletedPet = await this.petsRepository.deletePet(id);
    if (!deletedPet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return deletedPet;
  }
}
