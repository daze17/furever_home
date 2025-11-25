import { z } from "zod";

import { CustomerModel } from "@/models";

export const CreateCustomerProfileRequestBody = CustomerModel.pick({
  first_name: true,
  last_name: true,
  nickname: true,
  address: true,
  phone: true,
  profile_image_url: true,
  gender: true,
  zip_code: true,
});
export type CreateCustomerProfileRequestBody = z.infer<
  typeof CreateCustomerProfileRequestBody
>;

export const CustomerProfileResponseBody = CustomerModel.pick({
  id: true,
  first_name: true,
  last_name: true,
  nickname: true,
  address: true,
  phone: true,
  profile_image_url: true,
  gender: true,
  zip_code: true,
}).extend({
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export type CustomerProfileResponseBody = z.infer<
  typeof CustomerProfileResponseBody
>;
