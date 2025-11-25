import { z } from "zod";

import { c } from "@/contract";
import { CustomError } from "@/models/custom_error";
import { CustomerProfileResponseBody } from "@/schemas/dtos";

export const customerProfileContract = c.router({
  getCustomerProfile: {
    method: "GET",
    path: "/profile",
    responses: {
      200: CustomerProfileResponseBody,
      400: CustomError,
    },
    summary: "get profile",
  },
});
