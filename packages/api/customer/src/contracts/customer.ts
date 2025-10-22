import { z } from "zod";

import { c } from "@/contract";
import { CustomError } from "@/models/custom_error";
import { CreateCustomerProfileRequestBody } from "@/schemas/dtos";

export const customerProfileContract = c.router({
  // getCustomerProfile: {
  //   method: "GET",
  //   path: "/profile",
  //   responses: {
  //     200: UserProfileResponse,
  //     400: CustomError,
  //   },
  //   summary: "get profile",
  // },
});
