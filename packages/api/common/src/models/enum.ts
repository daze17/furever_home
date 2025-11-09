import { customer_accounts, status } from "database";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const CustomerStatusEnum = createSelectSchema(customer_accounts).shape.status;
export type CustomerStatusEnum = z.infer<typeof CustomerStatusEnum>;
