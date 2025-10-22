import { Inject, Injectable } from "@nestjs/common";
import { CreateCustomerProfileRequestBody } from "customer_api";
import { customer_accounts, customers } from "database";
import { and, eq, exists } from "drizzle-orm";

import type { Database } from "@/modules/database/database.providers";

@Injectable()
export class CustomerRepository {
  constructor(@Inject("DATABASE") private readonly db: Database) {}

  async getCustomerProfileById(id: string) {
    const profile = await this.db.query.customers.findFirst({
      where: eq(customers.id, id),
    });

    return profile;
  }

  async getCustomerProfileByAccountId(accountId: string) {
    const profile = await this.db.query.customers.findFirst({
      where: exists(
        this.db
          .select()
          .from(customer_accounts)
          .where(
            and(
              eq(customer_accounts.customer_id, customers.id),
              eq(customer_accounts.id, accountId),
            ),
          ),
      ),
    });
    if (!profile) return null;

    return profile;
  }

  async createCustomerProfile(data: CreateCustomerProfileRequestBody) {
    const {
      first_name,
      last_name,
      nickname,
      address,
      phone,
      profile_image_url,
      gender,
      zip_code,
    } = data;
    await this.db.insert(customers).values({
      first_name,
      last_name,
      nickname,
      address,
      phone,
      profile_image_url,
      gender,
      zip_code,
    });
  }
}
