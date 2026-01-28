import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MimeTypeEnum } from "common_api";
import {
  CreatePetMedicalRecordRequestBody,
  CreatePetRequestBody,
  PetsQuery,
  UpdatePetMedicalRecordRequestBody,
} from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";
import { AwsService } from "@/modules/aws/aws.service";
import { AwsS3Service } from "@/modules/aws_s3/aws_s3.service";
import { TransactionWorkService } from "@/modules/database/transaction_work.service";

import { PetsRepository } from "./pets.repository";

@Injectable()
export class PetsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly awsS3Service: AwsS3Service,
    private readonly config: ConfigService,
    private readonly cls: ClsService,
    private readonly petsRepository: PetsRepository,
    private readonly transactionWorkService: TransactionWorkService,
  ) {}

  async createPet(data: CreatePetRequestBody) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    await this.petsRepository.createPetAndPetExtraInformations(
      accountProfile.id,
      data,
    );
  }

  async createPetMedicalRecord(
    id: number,
    data: CreatePetMedicalRecordRequestBody,
  ) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);
    const pet = await this.petsRepository.getOwnPet(accountProfile.id, id);
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    await this.petsRepository.createPetMedicalRecord(id, data);
  }

  async updatePetMedicalRecord(
    id: number,
    data: UpdatePetMedicalRecordRequestBody,
  ) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);
    const pet = await this.petsRepository.getOwnPet(accountProfile.id, id);
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    await this.transactionWorkService.run(async (tx) => {
      await this.petsRepository.deletePetMedicalRecord(id, tx);
      await this.petsRepository.createPetMedicalRecord(id, data, tx);
    });
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

  async uploadPetImages(files: Express.Multer.File[]) {
    if (!files) {
      throw new UnprocessableEntityException("FILES_NOT_INCLUDED");
    }

    const isValid = files.every((file) =>
      Object.values(MimeTypeEnum.enum).includes(file.mimetype as MimeTypeEnum),
    );

    if (!isValid) {
      throw new UnprocessableEntityException("INVALID_FILE_TYPE");
    }

    const uploadedFiles = await this.awsS3Service.uploadMultiplePublicFiles(
      files,
      "pet_images",
    );

    const urls = uploadedFiles.map((file) =>
      new URL(file.key, this.config.get("app.assetHost")).toString(),
    );

    return urls;
  }
}
