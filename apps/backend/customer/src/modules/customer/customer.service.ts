import { Injectable, NotFoundException } from "@nestjs/common";
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
}
