import { Controller, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TsRestHandler, tsRestHandler } from "@ts-rest/nest";
import { customerContract, CustomerProfileResponseBody } from "customer_api";
import { FileFastifyInterceptor } from "fastify-file-interceptor";

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

  @TsRestHandler(customerContract.customer.updateCustomerProfile)
  async updateCustomerProfile() {
    return tsRestHandler(
      customerContract.customer.updateCustomerProfile,
      async ({ body }) => {
        await this.customerService.updateCustomerProfile(body);
        console.log(body, "body");

        return {
          status: 200,
          body: {},
        };
      },
    );
  }

  @TsRestHandler(customerContract.customer.uploadProfileImage)
  @UseInterceptors(FileFastifyInterceptor("file", {}))
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    return tsRestHandler(
      customerContract.customer.uploadProfileImage,
      async () => {
        const uploadedUrl = await this.customerService.uploadProfileImage(file);

        return {
          status: 201,
          body: uploadedUrl,
        };
      },
    );
  }
}
