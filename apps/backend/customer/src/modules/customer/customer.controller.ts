import { Controller } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { customerContract, CustomerProfileResponseBody } from "customer_api";

import { CustomerService } from "./customer.service";

@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @TsRestHandler(customerContract.customer.getCustomerProfile)
  async getCustomerProfile() {
    return tsRestHandler(
      customerContract.customer.getCustomerProfile,
      async () => {
        const response = await this.customerService.getCustomerProfile();

        const parsedData = CustomerProfileResponseBody.parse(response);

        return {
          status: 200,
          body: parsedData,
        };
      },
    );
  }
}
