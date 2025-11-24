import { customer_accounts, status } from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const CustomerStatusEnumSchema = createSelectSchema(customer_accounts).shape.status;
export type CustomerStatusEnum = z.infer<typeof CustomerStatusEnumSchema>;

// Export enum values for runtime usage
export const CustomerStatusEnum = {
  active: "active",
  inactive: "inactive",
  pending: "pending",
} as const;
