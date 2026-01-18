import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MimeTypeEnum } from "common_api";
import { UpdateCustomerProfileRequestBody } from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";
import { AwsS3Service } from "@/modules/aws_s3/aws_s3.service";

import { CustomerRepository } from "./customer.repository";

@Injectable()
export class CustomerService {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly cls: ClsService,
    private readonly configService: ConfigService,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async getCustomerProfile() {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    const customerProfile =
      await this.customerRepository.getCustomerProfileById(accountProfile.id);
    if (!customerProfile) {
      throw new NotFoundException("CUSTOMER_NOT_FOUND");
    }

    return customerProfile;
  }

  async updateCustomerProfile(data: UpdateCustomerProfileRequestBody) {
    const accountProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    await this.customerRepository.updateCustomerProfileById(
      accountProfile.id,
      data,
    );
  }

  async uploadProfileImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new UnprocessableEntityException("FILE_NOT_INCLUDED");
    }

    const validMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new UnprocessableEntityException("INVALID_FILE_TYPE");
    }

    const uploadedFiles = await this.awsS3Service.uploadMultiplePublicFiles(
      [file],
      "profile_images",
    );

    const uploadedFile = uploadedFiles[0];
    if (!uploadedFile) {
      throw new UnprocessableEntityException("FILE_UPLOAD_FAILED");
    }

    const url = new URL(
      uploadedFile.key,
      this.configService.get("app.assetHost"),
    ).toString();

    return url;
  }
}
