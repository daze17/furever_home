import { customer_accounts, customer_settings, customers } from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const CustomerModel = createSelectSchema(customers);
export type CustomerModel = z.infer<typeof CustomerModel>;

export const CustomerAccountModel = createSelectSchema(customer_accounts);
export type CustomerAccountModel = z.infer<typeof CustomerAccountModel>;

export const CustomerSettingModel = createSelectSchema(customer_settings);
export type CustomerSettingModel = z.infer<typeof CustomerSettingModel>;
