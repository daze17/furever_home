import { Injectable, NotFoundException } from "@nestjs/common";
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
}
