import z from "zod";

import { c } from "@/contract";
import { CustomError } from "@/models/custom_error";
import {
  CustomerSettingsResponseBody,
  UpdateCustomerSettingsRequestBody,
} from "@/schemas/dtos";

export const customerSettingsContract = c.router({
  getCustomerSettings: {
    method: "GET",
    path: "/settings",
    responses: {
      200: CustomerSettingsResponseBody,
      404: CustomError,
    },
    summary: "Get current user's notification settings",
  },
  updateCustomerSettings: {
    method: "PATCH",
    path: "/settings",
    body: UpdateCustomerSettingsRequestBody,
    responses: {
      200: z.object({}),
      400: CustomError,
      404: CustomError,
    },
    summary: "Update notification preferences",
  },
});
