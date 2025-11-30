import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateCustomerSettingsRequestBody } from "customer_api";
import { ClsService } from "nestjs-cls";

import { CLS_KEYS } from "@/common/constants/cls.constants";

import { CustomerSettingsRepository } from "./customer_settings.repository";

@Injectable()
export class CustomerSettingsService {
  constructor(
    private readonly cls: ClsService,
    private readonly customerSettingsRepository: CustomerSettingsRepository,
  ) {}

  async getCustomerSettings() {
    const customerProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    const settings =
      await this.customerSettingsRepository.getCustomerSettingsByCustomerId(
        customerProfile.id,
      );

    if (!settings) {
      throw new NotFoundException("CUSTOMER_SETTINGS_NOT_FOUND");
    }

    return settings;
  }

  async updateCustomerSettings(data: UpdateCustomerSettingsRequestBody) {
    const customerProfile = this.cls.get(CLS_KEYS.CUSTOMER_PROFILE);

    // Verify settings exist
    const existingSettings =
      await this.customerSettingsRepository.getCustomerSettingsByCustomerId(
        customerProfile.id,
      );

    if (!existingSettings) {
      throw new NotFoundException("CUSTOMER_SETTINGS_NOT_FOUND");
    }

    await this.customerSettingsRepository.updateCustomerSettings(
      customerProfile.id,
      data,
    );
  }
}
