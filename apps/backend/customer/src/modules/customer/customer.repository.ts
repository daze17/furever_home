import { Inject, Injectable } from "@nestjs/common";
import { CreateCustomerProfileRequestBody } from "customer_api";
import { customers } from "database";
import { and, eq } from "drizzle-orm";

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
    const customerIds = await this.db
      .insert(customers)
      .values({
        first_name,
        last_name,
        nickname,
        address,
        phone,
        profile_image_url,
        gender,
        zip_code,
      })
      .returning({ id: customers.id });
    const customerId = customerIds.find(Boolean)!.id;
    return customerId;
  }
}
