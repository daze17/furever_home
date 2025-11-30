import { z } from "zod";

import { CustomerSettingModel } from "@/models";

/**
 * Request body for updating customer settings
 * Only notification preferences are updatable
 */
export const UpdateCustomerSettingsRequestBody = CustomerSettingModel.pick({
  receive_email_notification: true,
  receive_sms_notification: true,
}).partial(); // Both fields are optional, user can update either or both

export type UpdateCustomerSettingsRequestBody = z.infer<
  typeof UpdateCustomerSettingsRequestBody
>;

/**
 * Response body for customer settings
 * Returns all settings fields with timestamps
 */
export const CustomerSettingsResponseBody = CustomerSettingModel.pick({
  id: true,
  receive_email_notification: true,
  receive_sms_notification: true,
  customer_id: true,
}).extend({
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type CustomerSettingsResponseBody = z.infer<
  typeof CustomerSettingsResponseBody
>;
