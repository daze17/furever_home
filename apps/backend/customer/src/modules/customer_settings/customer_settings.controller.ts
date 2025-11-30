import { Controller } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { customerContract, CustomerSettingsResponseBody } from "customer_api";

import { CustomerSettingsService } from "./customer_settings.service";

@Controller()
export class CustomerSettingsController {
  constructor(
    private readonly customerSettingsService: CustomerSettingsService,
  ) {}

  @TsRestHandler(customerContract.customerSettings.getCustomerSettings)
  async getCustomerSettings() {
    return tsRestHandler(
      customerContract.customerSettings.getCustomerSettings,
      async () => {
        const settings =
          await this.customerSettingsService.getCustomerSettings();

        const parsedData = CustomerSettingsResponseBody.parse(settings);

        return {
          status: 200,
          body: parsedData,
        };
      },
    );
  }

  @TsRestHandler(customerContract.customerSettings.updateCustomerSettings)
  async updateCustomerSettings() {
    return tsRestHandler(
      customerContract.customerSettings.updateCustomerSettings,
      async ({ body }) => {
        const updatedSettings =
          await this.customerSettingsService.updateCustomerSettings(body);

        return {
          status: 200,
          body: {},
        };
      },
    );
  }
}
