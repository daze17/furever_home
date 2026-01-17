import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateCustomerProfileRequestBody } from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";

import { CustomerRepository } from "./customer.repository";

@Injectable()
export class CustomerService {
  constructor(
    private readonly cls: ClsService,
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

    const updatedProfile =
      await this.customerRepository.updateCustomerProfileById(
        accountProfile.id,
        data,
      );
    if (!updatedProfile) {
      throw new NotFoundException("CUSTOMER_NOT_FOUND");
    }

    return updatedProfile;
  }
}
