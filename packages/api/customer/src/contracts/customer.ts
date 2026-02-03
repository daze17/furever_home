import { z } from "zod";

import { c } from "@/contract";
import { CustomError } from "@/models/custom_error";
import {
  CustomerProfileResponseBody,
  UpdateCustomerProfileRequestBody,
} from "@/schemas/dtos";

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
  updateCustomerProfile: {
    method: "PATCH",
    path: "/profile",
    body: UpdateCustomerProfileRequestBody,
    responses: {
      200: z.object({}),
      404: CustomError,
    },
    summary: "update profile",
  },
  uploadProfileImage: {
    method: "POST",
    path: "/profile/upload-image",
    body: z.object({}),
    contentType: "multipart/form-data",
    responses: {
      201: z.string(),
    },
    summary: "Upload profile image and return S3 URL",
  },
});
